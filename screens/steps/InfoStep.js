import React from 'react';
import { View } from 'react-native';

import FilmForm from './../infoForms/FilmForm';
import MusiqueForm from './../infoForms/MusiqueForm';
import SerieForm from './../infoForms/SerieForm';
import PodcastForm from './../infoForms/PodcastForm';
import YoutubeForm from './../infoForms/YoutubeForm';

export default function InfoStep({ formData, onChange, onNext, onBack }) {
  const category = formData?.type;

  const commonProps = {
    formData: formData || {},
    onNext,
    onBack,
    onChange,
  };
  
  switch (category) {
    case 'Film':
      return <FilmForm {...commonProps} />;
    case 'Série':
      return <SerieForm {...commonProps} />;
    case 'Musique':
      return <MusiqueForm {...commonProps} />;
    case 'Podcast':
      return <PodcastForm {...commonProps} />;
    case 'Youtube':
      return <YoutubeForm {...commonProps} />;
    default:
      return <View />;
  }
}