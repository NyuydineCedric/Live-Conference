import api from './api'

const MEETINGS_API = '/api/meetings'

export const meetingsService = {
  // Get all meetings
  async getAllMeetings() {
    const { data } = await api.get(MEETINGS_API)
    return data
  },

  // Get upcoming meetings
  async getUpcomingMeetings() {
    const { data } = await api.get(`${MEETINGS_API}/upcoming`)
    return data
  },

  // Get recent meetings
  async getRecentMeetings() {
    const { data } = await api.get(`${MEETINGS_API}/recent`)
    return data
  },

  // Get meeting by ID
  async getMeetingById(meetingId) {
    const { data } = await api.get(`${MEETINGS_API}/${meetingId}`)
    return data.meeting || data  // Extract the meeting object
  },

  // Create meeting - FIXED to return the meeting object
  async createMeeting(meetingData) {
    const { data } = await api.post(MEETINGS_API, meetingData)
    console.log("Create meeting API response:", data)
    // Return the meeting object from the response
    return data.meeting || data
  },

  // Schedule meeting
  async scheduleMeeting(meetingData) {
    const { data } = await api.post(`${MEETINGS_API}/schedule`, meetingData)
    return data.meeting || data
  },

  // Join meeting
  async joinMeeting(meetingId) {
    const { data } = await api.post(`${MEETINGS_API}/${meetingId}/join`)
    return data
  },

  // Leave meeting
  async leaveMeeting(meetingId) {
    const { data } = await api.post(`${MEETINGS_API}/${meetingId}/leave`)
    return data
  },

  // End meeting
  async endMeeting(meetingId) {
    const { data } = await api.post(`${MEETINGS_API}/${meetingId}/end`)
    return data
  },

  // Get participants
  async getParticipants(meetingId) {
    const { data } = await api.get(`${MEETINGS_API}/${meetingId}/participants`)
    return data
  },

  // Get comments
  async getComments(meetingId) {
    const { data } = await api.get(`${MEETINGS_API}/${meetingId}/comments`)
    return data
  },

  // Add comment
  async addComment(meetingId, comment) {
    const { data } = await api.post(`${MEETINGS_API}/${meetingId}/comments`, {
      text: comment,
    })
    return data
  },
}