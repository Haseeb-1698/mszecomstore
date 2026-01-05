export const services = [
  {
    slug: 'netflix',
    name: 'Netflix',
    description: 'Stream unlimited movies and TV shows.',
    longDescription: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.',
    price: '$9.99/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    pricingTiers: [
      { name: 'Basic', price: '$9.99/mo', quality: 'SD (480p)' },
      { name: 'Standard', price: '$15.49/mo', quality: 'HD (1080p)' },
      { name: 'Premium', price: '$19.99/mo', quality: 'UHD (4K) + HDR' },
    ]
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    description: 'Music for everyone. Ad-free listening.',
    longDescription: 'Spotify is a digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world. Basic functions are free, but you can also choose to upgrade to Spotify Premium.',
    price: '$10.99/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    pricingTiers: [
      { name: 'Individual', price: '$10.99/mo', quality: '320kbps' },
      { name: 'Duo', price: '$14.99/mo', quality: '320kbps' },
      { name: 'Family', price: '$16.99/mo', quality: '320kbps' },
    ]
  },
  {
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    description: 'The world’s best creative apps and services.',
    longDescription: 'Adobe Creative Cloud is a set of applications and services from Adobe Inc. that gives subscribers access to a collection of software used for graphic design, video editing, web development, photography, along with a set of mobile applications and also some optional cloud services.',
    price: '$54.99/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Adobe_Creative_Cloud_Logo.svg',
    pricingTiers: [
      { name: 'Photography (20GB)', price: '$9.99/mo', quality: 'N/A' },
      { name: 'All Apps', price: '$54.99/mo', quality: 'N/A' },
      { name: 'Single App', price: '$20.99/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'notion',
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    longDescription: 'Notion is an application that provides components such as notes, databases, kanban boards, wikis, calendars and reminders. Users can connect these components to create their own systems for knowledge management, note taking, data management, project management, among others.',
    price: '$8/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
    pricingTiers: [
      { name: 'Plus', price: '$8/mo', quality: 'N/A' },
      { name: 'Business', price: '$15/mo', quality: 'N/A' },
      { name: 'Enterprise', price: 'Contact us', quality: 'N/A' },
    ]
  },
  {
    slug: 'figma',
    name: 'Figma',
    description: 'The collaborative interface design tool.',
    longDescription: 'Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications for macOS and Windows. The Figma mobile app for Android and iOS allows viewing and interacting with Figma prototypes in real-time on mobile and tablet devices.',
    price: '$12/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    pricingTiers: [
      { name: 'Professional', price: '$12/mo', quality: 'N/A' },
      { name: 'Organization', price: '$45/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    description: 'The streaming home of your favorite stories.',
    price: '$7.99/mo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    longDescription: 'Disney+ is the streaming home of your favorite stories from Disney, Pixar, Marvel, Star Wars, and National Geographic. Watch the latest releases, Original series and movies, classic films, and more.',
    pricingTiers: [
      { name: 'Basic (With Ads)', price: '$7.99/mo', quality: 'Up to 4K UHD' },
      { name: 'Premium (No Ads)', price: '$13.99/mo', quality: 'Up to 4K UHD' },
    ]
  }
];
