// queue name
export enum QueueName {
  STAFF = 'staff',
}

// specific tasks
export enum JobName {
  STAFF_STORE_CHECKIN_INFO = 'staff-store-checkin-info',
  STAFF_CHECKIN_SUMMARY_DAILY = 'staff-checkin-summary-daily',
}

export interface StaffJobDataType {
  date?: string;
}
