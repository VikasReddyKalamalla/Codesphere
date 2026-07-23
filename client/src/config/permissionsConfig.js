export const PERMISSIONS_CONFIG = {
  STUDENT: ['read:courses', 'read:sessions', 'write:posts'],
  INSTRUCTOR: ['read:courses', 'write:courses', 'read:students', 'write:sessions'],
  ADMIN: ['all'],
  GUEST: ['read:courses']
};
export default PERMISSIONS_CONFIG;
