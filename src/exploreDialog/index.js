import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import search from '../assets/search_.png';
import cal from '../assets/cal.png';

export default function ExploreDialog({ showExploreDialog }) {
  const [close, setClose] = useState(false);

  const handleClose = () => {
    setClose(true);
  };

  const items = [
    {
      img: search,
      title: 'Manage your members and visitors',
      description:
        'Easily search, update, and filter member information. Quickly locate members, update details, and apply filters for refined results.',
    },
    {
      img: cal,
      title: 'Manage Your Events',
      description:
        'Manage and organize events with ease. Create, update, and view event details efficiently.',
    },
    {
      img: search,
      title: 'All Your Data In One Place',
      description:
        'Gain insights with a comprehensive overview. Track key metrics and monitor member activities.',
    },
  ];

  return (
    <Dialog open={showExploreDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        {' '}
        <div className="flex flex-col space-around">
          <p
            className="place-self-end text-red-500 cursor-pointer"
            onClick={showExploreDialog}
          >
            X
          </p>
          <span className="text-2xl">Explore</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <Card>
          <Carousel
            navButtonsProps={{
              style: {
                backgroundColor: 'cornflowerblue',
                borderRadius: 50,
              },
            }}
            navButtonsWrapperProps={{
              style: {
                bottom: '0',
                top: 'unset',
              },
            }}
            indicatorContainerProps={{
              style: {
                marginTop: '10px',
                textAlign: 'center',
              },
            }}
          >
            {items.map((item, i) => (
              <Card key={i} sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  sx={{ width: 'auto', maxHeight: '300px' }}
                  src={item.img}
                  alt={item.title}
                />
                <CardContent
                  sx={{ p: 4, backgroundColor: 'background.default' }}
                >
                  <Typography variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
