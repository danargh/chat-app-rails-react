import * as z from 'zod';

export const LoginSchema = z.object({
   email: z.string({ message: 'halo' }).min(1, 'Email must filled').email('Please enter a valid email address'),
   password: z.string().min(1, 'Password must filled'),
});

export const RegisterSchema = z
   .object({
      username: z.string().min(1, 'Username must filled'),
      fullname: z.string().min(1, 'Fullname must filled'),
      email: z.string({ message: 'halo' }).min(1, 'Email must filled').email('Please enter a valid email address'),
      password: z.string().min(1, 'Password must filled'),
      confirmPassword: z.string().min(1, 'Confirm password must filled'),
   })
   .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
         ctx.addIssue({
            code: 'custom',
            message: 'The password did not match',
            path: ['confirmPassword'],
         });
      }
   });
