const welcomeEmail = (name) => {
  return `
  <div style="font-family:Arial;padding:30px;background:#120b08;color:white">

    <h1 style="color:#facc15;">
      Welcome to CartHub
    </h1>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your CartHub account has been created successfully.
    </p>

    <p>
      You can now:
    </p>

    <ul>
      <li>Browse local stores, restaurants, and service providers</li>
      <li>Place orders</li>
      <li>Track your orders</li>
      <li>Become a vendor</li>
    </ul>

    <br>

    <p>
      Enjoy a seamless local marketplace experience.
    </p>

    <h3 style="color:#facc15;">
      Team CartHub
    </h3>

  </div>
  `;
};

export default welcomeEmail;