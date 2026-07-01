const verificationEmail = (name, verificationLink) => {
  return `
    <div style="font-family:Arial;background:#120b08;padding:40px;color:white">

      <h1 style="color:#facc15">
        Verify your CartHub Account
      </h1>

      <p>Hello ${name},</p>

      <p>
        Thanks for signing up!
      </p>

      <p>
        Please verify your email address by clicking the button below.
      </p>

      <br>

      <a
        href="${verificationLink}"
        style="
          background:#facc15;
          color:black;
          padding:15px 30px;
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
        "
      >
        Verify Email
      </a>

      <br><br>

      <p>
        If you didn't create this account,
        simply ignore this email.
      </p>

      <hr>

      <p style="color:#888">
        CartHub Team
      </p>

    </div>
  `;
};

export default verificationEmail;