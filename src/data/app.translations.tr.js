const appTranslationsTr = {
  settings: {
    siteName: "Deliorman Restoran",
    siteDescription:
      "Deliorman Restoran, rahat ve otantik bir atmosferde en kaliteli yerel ürünlerle hazırlanan geleneksel Bulgar ve bölgesel yemeklerle eşsiz bir mutfak deneyimi sunar.",
  },
  header: {
    menu: [
      { label: "Ana Sayfa" },
      {
        label: "Menü",
        children: [{ label: "Klasik Menü" }, { label: "Öğle Menüsü" }],
      },
      {
        label: "Hakkımızda",
        children: [
          { label: "Restoran Hakkında" },
          { label: "Özel Günler" },
          { label: "Hizmetler" },
        ],
      },
      { label: "Galeri" },
      { label: "İletişim" },
      { label: "Rezervasyon" },
      { label: "Geri Bildirim" },
    ],
    onepage: [
      { label: "Ana Sayfa" },
      { label: "Hakkımızda" },
      { label: "Menü" },
      { label: "İletişim" },
    ],
  },
  footer: {
    about: {
      title: "Deliorman Restoran Hakkında",
      text: "Deliorman Restoran, Samuil köyünün kalbinde yer alan bir mutfak mücevheridir. Felsefemiz, yalnızca en taze yerel malzemeleri kullanarak geleneksel tarifleri modern mutfak teknikleriyle birleştirmektir. Tüm misafirlerimiz için eşsiz bir gastronomi deneyimi yaratıyoruz.",
      button: { label: "Menüyü Görüntüle" },
    },
    contact: {
      title: "İletişim Bilgileri",
      items: [
        { label: "Rezervasyon \n Telefonu" },
        { label: "E-posta" },
        { label: "Adres" },
      ],
      button: { label: "Masa Ayırt" },
    },
    gallery: {
      title: "Restoranımızdan Galeri",
      button: { label: "Daha Fazla Fotoğraf" },
    },
    legal: {
      links: [{ label: "Şartlar ve Koşullar / Gizlilik" }],
    },
  },
};

export default appTranslationsTr;
