import { gql } from '@apollo/client';

export const GET_TASK_STATUS = gql`
  query taskStatus {
    taskStatus {
      items {
        id
        name
      }
    }
  }
`;

export const GET_TASK_TYPES = gql`
  query taskType {
    taskType {
      items {
        id
        name
      }
    }
  }
`;

export const GET_ALL_TASKS = gql`
  query tasks(
    $onlyMyTask: Boolean
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $taskStatusIds: String
    $taskTypeIds: String
    $date: String
  ) {
    tasks(
      onlyMyTask: $onlyMyTask
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      taskStatusIds: $taskStatusIds
      taskTypeIds: $taskTypeIds
      date: $date
    ) {
      items {
        taskId
        attachFiles
        committeeId
        createBy
        deadlineDate
        description
        executorId
        executorName
        meetingId
        priority
        priorityId
        subjectId
        taskStatusId
        taskStatus
        taskType
        taskTypeId
        title
        userId
        isHead
        isExecutor
        isTaskApproval
        isMeetingApproval
        isSubjectApproval
      }
      totalCount
      pageSize
    }
  }
`;

export const GET_TIMELINE_REVIEW = gql`
  query timeReviewMobile(
    $startTime: String
    $endTime: String
    $date: String
    $requiredUserIds: String
    $optionalUserIds: String
    $timeStart: String
    $timeEnd: String
  ) {
    timeReviewMobile(
      startTime: $startTime
      endTime: $endTime
      date: $date
      requiredUserIds: $requiredUserIds
      optionalUserIds: $optionalUserIds
      timeStart: $timeStart
      timeEnd: $timeEnd
    ) {
      userEvents
    }
  }
`;

export const GET_ALL_SUBJECTS_STATUS = gql`
  query subjectStatus {
    subjectStatus {
      items {
        subjectStatusId
        subjectStatus
      }
    }
  }
`;

export const GET_TIMEZONE = gql`
  query timeZone {
    timeZone {
      items {
        timeZone
        timeZoneId
      }
    }
  }
`;

export const GET_APPOINTMENT_BY_ID = gql`
  query appointment($id: Long) {
    appointment(id: $id) {
      appointmentDescription
      appointmentId
      appointmentTitle
      attachFileIds
      committeeId
      committeeName
      yourRoleId
      yourRoleName
      creatorName
      endDate
      endTime
      locationName
      setDate
      setTime
      platformlink
      platformName
      locationId
      repeat
      repeatName
      timeZone
      userDetails {
        answer
        email
        roleId
        roleName
        userName
        isAvailable
        isRequired
        userId
        suggestedTime
      }
    }
  }
`;

export const GET_All_APPOINTMENT = gql`
  query appointments(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
  ) {
    appointments(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
    ) {
      items {
        appointmentId
        appointmentTitle
        committeeName
        creatorName
        yourRoleName
        locationName
        setDate
        isDisable
        answers
      }
      page
      totalCount
      pageSize
    }
  }
`;

export const GET_All_USERS = gql`
  query committeeMembersList(
    $page: Int
    $pageSize: Int
    $roleFilterIds: String
    $searchValue: String
    $sort: String
    $externalUser: Boolean
    $organizationId: Long
    $isDeleted: Boolean
  ) {
    committeeMembersList(
      page: $page
      pageSize: $pageSize
      roleFilterIds: $roleFilterIds
      searchValue: $searchValue
      sort: $sort
      externalUser: $externalUser
      organizationId: $organizationId
      isDeleted: $isDeleted
    ) {
      items {
        userId
        firstName
        secondName
        familyName
        emails
        phoneNumber
        isDisable
        roles
        organizations
        privateDetails
        externalUser
        organizationIds
        status
      }
      page
      pageSize
      totalCount
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query committeeMemberById($userId: Long) {
    committeeMemberById(userId: $userId) {
      title
      attachFiles
      emails
      externalUser
      familyName
      firstName
      googleCalendarSync
      organizations
      outlookCalendarSync
      phoneNumber
      privateDetails
      profilePicture
      roles
      secondName
      sendSMS
      thirdName
      userId
    }
  }
`;

export const GET_AUTH = gql`
  query oAuth2Application($domainName: String) {
    oAuth2Application(domainName: $domainName) {
      clientId
      clientSecret
    }
  }
`;

export const GET_All_SUBJECTS = gql`
  query subjects(
    $committeeId: Long
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $deadline: Boolean
    $screen: Int
  ) {
    subjects(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      committeeId: $committeeId
      deadline: $deadline
      screen: $screen
    ) {
      items {
        attachFileIds
        committeeId
        committeeName
        createrName
        dateOfCreation
        description
        draft
        subjectCategoryId
        subjectCategoryName
        subjectId
        subjectTitle
        userId
        subjectStatus
      }
      pageSize
      pageSize
      totalCount
    }
  }
`;

export const GET_All_SUBJECTS_CATEGORY = gql`
  query subjectCategories(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
  ) {
    subjectCategories(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
    ) {
      items {
        categoryTitle
        createBy
        description
        id
        isDisable
        modifiedBy
      }
    }
  }
`;
export const GET_SUBJECTS_CATEGORY_BY_ID = gql`
  query subjectCategory($id: long) {
    subjectCategory(id: $id) {
      categoryTitle
      createBy
      description
      id
      isDisable
      modifiedBy
      status
    }
  }
`;
export const GET_SUBJECT_BY_ID = gql`
  query subject($subjectId: Long) {
    subject(subjectId: $subjectId) {
      attachFileIds
      committeeId
      committeeName
      createrName
      dateOfCreation
      description
      draft
      subjectCategoryId
      subjectCategoryName
      subjectId
      subjectTitle
      userId
      subjectStatus
      commentThreadId
    }
  }
`;

export const GET_FILE = gql`
  query uploadedFile($fileEntryId: Long) {
    uploadedFile(fileEntryId: $fileEntryId) {
      contentUrl
      downloadUrl
      fileEnteryId
      groupId
      name
      size
      type
    }
  }
`;

export const GET_All_COMMITTEE = gql`
  query committees(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $isDeleted: Boolean
  ) {
    committees(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      isDeleted: $isDeleted
    ) {
      items {
        attachDocumentIds
        committeeId
        committeeCategoryId
        committeeTitle
        description
        expirationDate
        organizationId
        parentCommitteeId
        isDisable
        setUpDate
        userIds
        status
      }
      pageSize
      pageSize
      totalCount
    }
  }
`;

export const GET_COMMITTEE_BY_ID = gql`
  query committee($organizationId: Long) {
    committee(organizationId: $organizationId) {
      attachDocumentIds
      categoryTitle
      committeeCategoryId
      committeeId
      committeeTitle
      description
      expirationDate
      organizationId
      parentCommitteeId
      roleIds
      setUpDate
      userIds
    }
  }
`;

export const GET_COMMITTEES_BY_ROLE = gql`
  query committeesByRole(
    $head: Boolean
    $member: Boolean
    $secretary: Boolean
  ) {
    committeesByRole(head: $head, member: $member, secretary: $secretary) {
      items {
        categoryTitle
        children
        committeeId
        committeeTitle
        createBy
        description
        expirationDate
        isDisable
        organizationId
        parentCommitteeId
        setUpDate
        status
        title
        userIds
        attachDocumentIds
      }
    }
  }
`;

export const GET_All_COMMENTS_THREAD = gql`
  query comments($commentCategoryId: Long, $sort: String) {
    comments(commentCategoryId: $commentCategoryId, sort: $sort) {
      items {
        childComment
        comment
        commentId
        userId
        userName
        commentDate
        parentCommentId
        profilePicture
      }
      page
      totalCount
    }
  }
`;

export const GET_ZIP_PDF_DOWNLOAD = gql`
  query report(
    $attachFile: Boolean
    $comments: Boolean
    $format: String
    $id: Int
    $type: Int
  ) {
    report(
      attachFile: $attachFile
      comments: $comments
      format: $format
      id: $id
      type: $type
    ) {
      fileData
    }
  }
`;

export const GET_All_MEETING = gql`
  query meeting(
    $committeeId: Long
    $date: String
    $onlyMyMeeting: Boolean
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $screen: Int
  ) {
    meetings(
      committeeId: $committeeId
      date: $date
      onlyMyMeeting: $onlyMyMeeting
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      screen: $screen
    ) {
      items {
        attachFileIds
        committeeId
        creatorName
        description
        endDate
        locationId
        meetingId
        meetingStatusId
        meetingTitle
        platformlink
        platformId
        repeat
        setDate
        status
        timeZone
        workHours
        answers
        meetingStatusTitle
        yourRoleName
        platformlink
        userDetails {
          answer
          appointmentId
          email
          isAvailable
          isRequired
          meetingId
          roleId
          roleName
          suggestedTime
          userId
          userName
          videoConferenceId
        }
      }
    }
  }
`;

export const GET_MEETING_BY_ID = gql`
  query meeting($meetingId: Long) {
    meeting(meetingId: $meetingId) {
      attachFileIds
      availableId
      committeeId
      creatorName
      description
      endDate
      locationId
      meetingId
      meetingStatusId
      meetingTitle
      organizationIds
      platformlink
      platformId
      repeat
      required
      setDate
      status
      subjectIds
      subjectStatusIds
      timeZone
      userIds
      setTime
      endTime
      workHours
      yourRoleName
      userDetails {
        answer
        email
        roleId
        roleName
        userName
        isAvailable
        isRequired
        userId
        suggestedTime
      }
    }
  }
`;

export const GET_ALL_LOCATION_BY_ID = gql`
  query location($locationId: Long) {
    location(locationId: $locationId) {
      building
      city
      floor
      locationId
      googleMapURL
      peopleCapacity
      room
      street
      title
    }
  }
`;

export const GET_ALL_LOCATION = gql`
  query locations($locationType: Int) {
    locations(locationType: $locationType) {
      items {
        title
        locationId
      }
    }
  }
`;

export const GET_PLATFORMLINK = gql`
  query videoConferencePlatformLink($platformId: Long) {
    videoConferencePlatformLink(platformId: $platformId) {
      platformlink
      platformId
    }
  }
`;

export const GET_ROLES = gql`
  query roleList($taskRole: Boolean) {
    roleList(taskRole: $taskRole) {
      roles
    }
  }
`;
