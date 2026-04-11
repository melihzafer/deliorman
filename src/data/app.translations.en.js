const appTranslationsEn = {
  settings: {
    siteName: "Deliorman Restaurant",
    siteDescription:
      "Deliorman Restaurant offers a unique culinary experience with traditional Bulgarian and regional dishes, prepared with the highest quality local products in a cozy and authentic atmosphere.",
  },
  header: {
    menu: [
      { label: "Home" },
      {
        label: "Menu",
        children: [{ label: "Classic Menu" }, { label: "Lunch Menu" }],
      },
      {
        label: "About Us",
        children: [
          { label: "About the Restaurant" },
          { label: "Special Days" },
          { label: "Services" },
        ],
      },
      { label: "Gallery" },
      { label: "Contact" },
      { label: "Reservation" },
      { label: "Feedback" },
    ],
    onepage: [
      { label: "Home" },
      { label: "About Us" },
      { label: "Menu" },
      { label: "Contact" },
    ],
  },
  footer: {
    about: {
      title: 'About Restaurant "Deliorman"',
      text: 'Restaurant "Deliorman" is a culinary gem located in the heart of the village of Samuil. Our philosophy is to combine traditional recipes with modern culinary techniques, using only the freshest local ingredients. We create a unique gastronomic experience for all our guests.',
      button: { label: "View the Menu" },
    },
    contact: {
      title: "Contact Information",
      items: [
        { label: "Phone \n for reservations" },
        { label: "Email" },
        { label: "Address" },
      ],
      button: { label: "Reserve a Table" },
    },
    gallery: {
      title: "Gallery from Our Restaurant",
      button: { label: "View More Photos" },
    },
    legal: {
      links: [{ label: "Terms & Conditions / Privacy" }],
    },
  },
};

export default appTranslationsEn;
