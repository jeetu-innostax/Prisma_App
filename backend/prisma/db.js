// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();



// async function createUser() {
//     try {
//       const newUser = await prisma.user.create({
//         data: {
//           email: 'user@example.com',
//           name: 'John Doe',
//           // Add other required fields based on your User model schema
//         },
//       });
      
//       console.log('User created successfully:', newUser);
//       return newUser;
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw error;
//     } finally {
//       await prisma.$disconnect();
//     }
//   }
  
//   // Execute the function
//   createUser()
//     .catch((e) => {
//       console.error("Error creating user:", e);
//       process.exit(1);
//     });