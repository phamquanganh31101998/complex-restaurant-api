// queue name
export enum QueueName {
  STAFF = 'staff',
}

// specific tasks
export enum JobName {
  STAFF_CHECK_IN_SUMMARY_DAILY = 'staff-check-in-summary-daily',
}

export interface StaffJobDataType {
  date?: string;
}
