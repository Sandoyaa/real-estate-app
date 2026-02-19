import { ID } from 'react-native-appwrite';
import { config, databases } from './appwrite';
import { propertiesImages } from './data';

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId
};

const propertyTypes = ['House', 'Townhouse', 'Condo', 'Duplex', 'Studio', 'Villa', 'Apartment', 'Other'];

const facilities = ['Laundry', 'Gym', 'Pool', 'Wifi'];

function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
  if (minItems > maxItems) {
    throw new Error('minItems cannot be greater than maxItems');
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error('minItems or maxItems are out of valid range for the array');
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [arrayCopy[randomIndex], arrayCopy[i]];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing properties
    const existingProperties = await databases.listDocuments(config.databaseId!, COLLECTIONS.PROPERTY!);
    for (const doc of existingProperties.documents) {
      await databases.deleteDocument(config.databaseId!, COLLECTIONS.PROPERTY!, doc.$id);
    }
    console.log('Cleared existing properties.');

    // Fetch existing agents, reviews, galleries
    const agents = (await databases.listDocuments(config.databaseId!, COLLECTIONS.AGENT!)).documents;
    const reviews = (await databases.listDocuments(config.databaseId!, COLLECTIONS.REVIEWS!)).documents;
    const galleries = (await databases.listDocuments(config.databaseId!, COLLECTIONS.GALLERY!)).documents;

    console.log(`Found: ${agents.length} agents, ${reviews.length} reviews, ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 1; i <= 20; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

      const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[Math.floor(Math.random() * propertiesImages.length)];

      const property = await databases.createDocument(config.databaseId!, COLLECTIONS.PROPERTY!, ID.unique(), {
        name: `Property ${i}`,
        type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        description: `This is the description for Property ${i}.`,
        address: `123 Property Street, City ${i}`,
        geolocation: `192.168.1.${i}, 192.168.1.${i}`,
        price: Math.floor(Math.random() * 9000) + 1000,
        area: Math.floor(Math.random() * 3000) + 500,
        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 5) + 1,
        rating: Math.floor(Math.random() * 5) + 1,
        facilities: selectedFacilities,
        image: image,
        agent: assignedAgent.$id,
        reviews: assignedReviews.map((review) => review.$id),
        gallery: assignedGalleries.map((gallery) => gallery.$id)
      });

      console.log(`Seeded property: ${property.name}`);
    }

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

export default seed;
