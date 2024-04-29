// Complete the Index page component here
// Use chakra-ui
import { Box, Input, Button, Text, VStack, Image, useToast } from '@chakra-ui/react';
import { useState } from 'react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songData, setSongData] = useState(null);
  const toast = useToast();

  const handleSearch = async () => {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('4642e3fdf761477991140a71ec36597e:1f1ef85b93cc467290f77cdcca6b5cd1')
      },
      body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const searchData = await searchResponse.json();
    if (searchData.tracks && searchData.tracks.items.length > 0) {
      setSongData(searchData.tracks.items[0]);
    } else {
      toast({
        title: 'No results found',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setSongData(null);
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">Spotify Song Search</Text>
      <Input placeholder="Enter a song name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <Button colorScheme="blue" onClick={handleSearch}>Search</Button>
      {songData && (
        <Box textAlign="center">
          <Text fontSize="xl">{songData.name}</Text>
          <Text fontSize="md">by {songData.artists.map(artist => artist.name).join(', ')}</Text>
          <Image src={songData.album.images[0].url} alt="Album cover" boxSize="100px" />
          <audio controls src={songData.preview_url}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </VStack>
  );
};

export default Index;