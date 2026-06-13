import express from 'express'
import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  joinMeeting,
  leaveMeeting,
  endMeeting,
  getParticipants,
  getComments,
  addComment,
  getUpcomingMeetings,
  getRecentMeetings,
} from '../controllers/meetings.js'

const router = express.Router()

router.post('/', createMeeting)
router.get('/', getAllMeetings)
router.get('/upcoming', getUpcomingMeetings)
router.get('/recent', getRecentMeetings)
router.get('/:meetingId', getMeetingById)
router.post('/:meetingId/join', joinMeeting)
router.post('/:meetingId/leave', leaveMeeting)
router.post('/:meetingId/end', endMeeting)
router.get('/:meetingId/participants', getParticipants)
router.get('/:meetingId/comments', getComments)
router.post('/:meetingId/comments', addComment)

export default router
