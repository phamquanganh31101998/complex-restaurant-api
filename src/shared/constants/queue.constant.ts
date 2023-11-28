// queue name
export enum QueueName {
  STAFF = 'staff',
}

// specific tasks
export enum JobName {
  STAFF_CHECK_IN_SUMMARY_CALCULATION = 'staff-check-in-summary-calculation',
}

export interface StaffJobDataType {
  date?: string;
}
