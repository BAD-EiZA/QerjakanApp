import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import shortUUID from "short-uuid";
export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  try {
    const currUser = await getCurrUser()
    if(!currUser){
      return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    const transporter = nodemailer.createTransport({
      port: 465,
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "lolimilkitaa@gmail.com",
        pass: "utedlwzimybarwcb",
      },
      secure: true,
    });
    

    const generateUUID = shortUUID().new();
    const findEmail = await prisma.user.findFirst({
      where: {
        email: currUser?.email
      }
    })
    if(!findEmail) {
      return NextResponse.error()
    }
    if(!findEmail.email){
      return NextResponse.error()
    }
    const findBank = await prisma.userBankAccount.findFirst({
        where: {
            userId: findEmail.id
        }
    })
    if(!findBank){
        return NextResponse.json({ message: "Please Input Your Bank Information" , statusCode: 500});
    }
    else{
      const findUUID = await prisma.forgotPasswordToken.findFirst({
        where: {
          email: findEmail.email
        }
      })
      if(findUUID){
        return NextResponse.json({message: "The verification link to become a seller has been sent to your email, please check your email", statusCode: 400})
      }
        const createUUID = await prisma.forgotPasswordToken.create({
            data: {
              token: String(generateUUID),
              email: findEmail.email,
              tokenType: "VerifySeller"
            },
          });
          
          const mailData = {
            from: "lolimilkitaa@gmail.com",
            to: findEmail.email,
            subject: "Verify Seller Form",
            text: "To become a seller, please click the following url link",
            html: `<head>
              <title>Contoh Template Email</title>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style type="text/css">
              body {
                  background-color: #f6f6f6;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 3;
                  color: #333;
                  padding: 20px;
                  text-align: center;
                  justify-content: center;
                  align-items: center;
              }
              a {
                  color: #333;
                  background-color: aqua;
                  padding: 0.5rem;
                  border-radius: 10px;
                  text-decoration-line: none;
                  margin-top: 25px;
                  width: auto;
                  transition: all ease-in-out 1s;
              }
              a:hover {
                  color: #f6f6f6;
                  background-color: rgb(11, 145, 145);
                  transition: all ease-in-out 1s;
              }
              </style>
          </head>
          <body>
              <div class="container">
              <h1>Your Verification Link</h1>
              
              <a href="https://qerjakan.vercel.app/verifyseller/${createUUID.token}" class="button">Verify Account</a>
              </div>
          </body>`,
          };
          await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
          return NextResponse.json(
            { message: "Success to send verification", data: {} ,statusCode: 200},
            
          );
    }
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error give Review" }, { status: 500 });
  }
};
