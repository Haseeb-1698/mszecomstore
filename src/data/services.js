export const services = [
  {
    slug: 'netflix',
    name: 'Netflix',
    description: 'Stream unlimited movies and TV shows.',
    longDescription: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.',
    price: 'PKR 2,800/mo',
    logo: '/icons/netflix.svg',
    pricingTiers: [
      { name: 'Basic', price: 'PKR 2,800/mo', quality: 'SD (480p)' },
      { name: 'Standard', price: 'PKR 4,340/mo', quality: 'HD (1080p)' },
      { name: 'Premium', price: 'PKR 5,600/mo', quality: 'UHD (4K) + HDR' },
    ]
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    description: 'Music for everyone. Ad-free listening.',
    longDescription: 'Spotify is a digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world. Basic functions are free, but you can also choose to upgrade to Spotify Premium.',
    price: 'PKR 3,080/mo',
    logo: '/icons/spotify.svg',
    pricingTiers: [
      { name: 'Individual', price: 'PKR 3,080/mo', quality: '320kbps' },
      { name: 'Duo', price: 'PKR 4,200/mo', quality: '320kbps' },
      { name: 'Family', price: 'PKR 4,760/mo', quality: '320kbps' },
    ]
  },
  {
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    description: 'The world\'s best creative apps and services.',
    longDescription: 'Adobe Creative Cloud is a set of applications and services from Adobe Inc. that gives subscribers access to a collection of software used for graphic design, video editing, web development, photography, along with a set of mobile applications and also some optional cloud services.',
    price: 'PKR 15,400/mo',
    logo: '/icons/adobe-creative-cloud.svg',
    pricingTiers: [
      { name: 'Photography (20GB)', price: 'PKR 2,800/mo', quality: 'N/A' },
      { name: 'All Apps', price: 'PKR 15,400/mo', quality: 'N/A' },
      { name: 'Single App', price: 'PKR 5,880/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'notion',
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    longDescription: 'Notion is an application that provides components such as notes, databases, kanban boards, wikis, calendars and reminders. Users can connect these components to create their own systems for knowledge management, note taking, data management, project management, among others.',
    price: 'PKR 2,240/mo',
    logo: '/icons/notion.svg',
    pricingTiers: [
      { name: 'Plus', price: 'PKR 2,240/mo', quality: 'N/A' },
      { name: 'Business', price: 'PKR 4,200/mo', quality: 'N/A' },
      { name: 'Enterprise', price: 'Contact us', quality: 'N/A' },
    ]
  },
  {
    slug: 'figma',
    name: 'Figma',
    description: 'The collaborative interface design tool.',
    longDescription: 'Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications for macOS and Windows. The Figma mobile app for Android and iOS allows viewing and interacting with Figma prototypes in real-time on mobile and tablet devices.',
    price: 'PKR 3,360/mo',
    logo: '/icons/figma.svg',
    pricingTiers: [
      { name: 'Professional', price: 'PKR 3,360/mo', quality: 'N/A' },
      { name: 'Organization', price: 'PKR 12,600/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    description: 'The streaming home of your favorite stories.',
    price: 'PKR 2,240/mo',
    logo: '/icons/disney-plus.svg',
    longDescription: 'Disney+ is the streaming home of your favorite stories from Disney, Pixar, Marvel, Star Wars, and National Geographic. Watch the latest releases, Original series and movies, classic films, and more.',
    pricingTiers: [
      { name: 'Basic (With Ads)', price: 'PKR 2,240/mo', quality: 'Up to 4K UHD' },
      { name: 'Premium (No Ads)', price: 'PKR 3,920/mo', quality: 'Up to 4K UHD' },
    ]
  }
];