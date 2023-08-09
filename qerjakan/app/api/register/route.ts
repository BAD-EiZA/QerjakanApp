import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import shortUUID from "short-uuid";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password, dateBirth, gender } = body;
  const findEmail = await prisma.user.findFirst({
    where: {
      email: email
    }
  })
  if(findEmail){
    return NextResponse.json({message: "Email Already Used", statusCode: 400})
  }
  const hashedPassword = await bcrypt.hash(password, 12);
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
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      dateBirth: dateBirth,
      gender: gender,
      profiles: {
        create: {},
      },
    },
  });
  const generateUUID = shortUUID().new();
  const createUUID = await prisma.forgotPasswordToken.create({
    data: {
      token: String(generateUUID),
      email: email,
      tokenType: "VerifyAccount",
    },
  });
  if (!user) {
    return NextResponse.error();
  }
  if (!user.email) {
    return NextResponse.error();
  }
  const mailData = {
    from: "lolimilkitaa@gmail.com",
    to: user.email,
    subject: "Verify Account Form",
    text: "To Verify your Account, please click the following url link",
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
          <h1>Your Verify Account Link</h1>
          
          <a href="https://qerjakan.vercel.app/verifyaccount/newaccount/${createUUID.token}" class="button">Verify Account</a>
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
  

  return NextResponse.json({message: "Please Check Your Email To Verification Account", statusCode: 200});
}
