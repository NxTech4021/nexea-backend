export const isAdmin = (email: string) => {
  const pattern = /[a-zA-Z]+@nexea.co/g;

  return pattern.test(email);
};
