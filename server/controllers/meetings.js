import {
  readDatabase,
  writeDatabase,
  generateId,
} from '../utils/database.js'

export async function createMeeting(req, res) {
  try {
    const { title, description, scheduledAt } = req.body
    const hostId = req.user.id

    if (!title) {
      return res.status(400).json({
        message: 'Meeting title is required',
      })
    }

    const db = await readDatabase()

    const newMeeting = {
      id: generateId(),
      title,
      description: description || '',
      hostId,
      scheduledAt: scheduledAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      participants: [hostId],
      status: 'scheduled',
      comments: [],
    }

    db.meetings.push(newMeeting)
    await writeDatabase(db)

    res.status(201).json({
      message: 'Meeting created successfully',
      meeting: newMeeting,
    })
  } catch (error) {
    console.error('Create meeting error:', error)
    res.status(500).json({
      message: 'Failed to create meeting',
    })
  }
}

export async function getAllMeetings(req, res) {
  try {
    const db = await readDatabase()
    const userMeetings = db.meetings.filter(
      (m) =>
        m.hostId === req.user.id || m.participants.includes(req.user.id)
    )

    res.json({
      meetings: userMeetings,
    })
  } catch (error) {
    console.error('Get meetings error:', error)
    res.status(500).json({
      message: 'Failed to get meetings',
    })
  }
}

export async function getMeetingById(req, res) {
  try {
    const { meetingId } = req.params
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    if (
      meeting.hostId !== req.user.id &&
      !meeting.participants.includes(req.user.id)
    ) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    res.json({
      meeting,
    })
  } catch (error) {
    console.error('Get meeting error:', error)
    res.status(500).json({
      message: 'Failed to get meeting',
    })
  }
}

export async function joinMeeting(req, res) {
  try {
    const { meetingId } = req.params
    const userId = req.user.id
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId)
      await writeDatabase(db)
    }

    res.json({
      message: 'Joined meeting successfully',
      meeting,
    })
  } catch (error) {
    console.error('Join meeting error:', error)
    res.status(500).json({
      message: 'Failed to join meeting',
    })
  }
}

export async function leaveMeeting(req, res) {
  try {
    const { meetingId } = req.params
    const userId = req.user.id
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    meeting.participants = meeting.participants.filter((p) => p !== userId)
    await writeDatabase(db)

    res.json({
      message: 'Left meeting successfully',
    })
  } catch (error) {
    console.error('Leave meeting error:', error)
    res.status(500).json({
      message: 'Failed to leave meeting',
    })
  }
}

export async function endMeeting(req, res) {
  try {
    const { meetingId } = req.params
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    if (meeting.hostId !== req.user.id) {
      return res.status(403).json({
        message: 'Only host can end meeting',
      })
    }

    meeting.status = 'ended'
    meeting.endedAt = new Date().toISOString()
    await writeDatabase(db)

    res.json({
      message: 'Meeting ended',
      meeting,
    })
  } catch (error) {
    console.error('End meeting error:', error)
    res.status(500).json({
      message: 'Failed to end meeting',
    })
  }
}

export async function getParticipants(req, res) {
  try {
    const { meetingId } = req.params
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    const participants = meeting.participants.map((userId) => {
      const user = db.users.find((u) => u.id === userId)
      return {
        id: userId,
        name: user?.fullName || 'Unknown',
        isHost: meeting.hostId === userId,
        isMuted: false,
      }
    })

    res.json({
      participants,
    })
  } catch (error) {
    console.error('Get participants error:', error)
    res.status(500).json({
      message: 'Failed to get participants',
    })
  }
}

export async function getComments(req, res) {
  try {
    const { meetingId } = req.params
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    res.json({
      comments: meeting.comments || [],
    })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({
      message: 'Failed to get comments',
    })
  }
}

export async function addComment(req, res) {
  try {
    const { meetingId } = req.params
    const { text } = req.body
    const db = await readDatabase()

    const meeting = db.meetings.find((m) => m.id === meetingId)

    if (!meeting) {
      return res.status(404).json({
        message: 'Meeting not found',
      })
    }

    const user = db.users.find((u) => u.id === req.user.id)

    const newComment = {
      id: generateId(),
      author: user?.fullName || 'Anonymous',
      text,
      userId: req.user.id,
      timestamp: new Date().toISOString(),
    }

    if (!meeting.comments) {
      meeting.comments = []
    }

    meeting.comments.push(newComment)
    await writeDatabase(db)

    res.status(201).json({
      message: 'Comment added',
      comment: newComment,
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({
      message: 'Failed to add comment',
    })
  }
}

export async function getUpcomingMeetings(req, res) {
  try {
    const db = await readDatabase()
    const now = new Date()

    const upcomingMeetings = db.meetings
      .filter(
        (m) =>
          (m.hostId === req.user.id || m.participants.includes(req.user.id)) &&
          new Date(m.scheduledAt) > now
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))

    res.json({
      meetings: upcomingMeetings,
    })
  } catch (error) {
    console.error('Get upcoming meetings error:', error)
    res.status(500).json({
      message: 'Failed to get upcoming meetings',
    })
  }
}

export async function getRecentMeetings(req, res) {
  try {
    const db = await readDatabase()
    const now = new Date()

    const recentMeetings = db.meetings
      .filter(
        (m) =>
          (m.hostId === req.user.id || m.participants.includes(req.user.id)) &&
          new Date(m.scheduledAt) <= now
      )
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
      .slice(0, 10)

    res.json({
      meetings: recentMeetings,
    })
  } catch (error) {
    console.error('Get recent meetings error:', error)
    res.status(500).json({
      message: 'Failed to get recent meetings',
    })
  }
}
