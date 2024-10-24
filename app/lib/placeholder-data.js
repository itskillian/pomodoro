const users = [
  {
    id: 'C694F0E6-5928-4523-BA05-3788B043F3FD',
    name: 'User',
    email: 'user@examplemail.com',
    password: '12345',
  },
  {
    id: '5CBCC771-7F67-4DCF-BF92-4C93AB21EBC0',
    name: 'User2',
    email: 'user2@examplemail.com',
    password: 'password',
  }
];

const sessions = [
  {
    id: '0C0D3C4F-10ED-4A6D-A99F-B6C880725859',
    user_id: 'C694F0E6-5928-4523-BA05-3788B043F3FD',
    duration: '1356',
    work_duration: '1500',
    break_duration: '300',
  },
  {
    id: '32BE61B7-73D7-4D01-9DF2-7C2670801CF1',
    user_id: 'C694F0E6-5928-4523-BA05-3788B043F3FD',
    duration: '3000',
    work_duration: '3000',
    break_duration: '600',
  },
  {
    id: '639D565A-CD70-4279-848F-928622A3972B',
    user_id: '5CBCC771-7F67-4DCF-BF92-4C93AB21EBC0',
    duration: '125',
    work_duration: '300',
    break_duration: '300',
  }
];

const visitors = [
  { month: 'Jan', visitors: 2000 },
  { month: 'Feb', visitors: 1800 },
  { month: 'Mar', visitors: 2200 },
  { month: 'Apr', visitors: 2500 },
  { month: 'May', visitors: 2300 },
  { month: 'Jun', visitors: 3200 },
  { month: 'Jul', visitors: 3500 },
  { month: 'Aug', visitors: 3700 },
  { month: 'Sep', visitors: 2500 },
  { month: 'Oct', visitors: 2800 },
  { month: 'Nov', visitors: 3000 },
  { month: 'Dec', visitors: 4800 },
];

export { users, sessions, visitors };