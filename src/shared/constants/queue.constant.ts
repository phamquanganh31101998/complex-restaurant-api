// queue name
export enum QueueName {
  STAFF = 'staff',
}

// specific tasks
export enum JobName {
  STAFF_STORE_CHECKIN_INFO = 'staff-store-checkin-info',
  STAFF_EXPORT_CHECKIN_INFO_DAILY = 'staff-export-checkin-info-daily',
}

export interface StaffJobDataType {
  date?: string;
}
