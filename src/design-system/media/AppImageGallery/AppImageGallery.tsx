import {
  AppImage,
} from '../../primitives';

import {
  AppCarousel,
} from '../AppCarousel';

import type {
  AppImageGalleryProps,
} from './AppImageGallery.types';

export const AppImageGallery = ({
  items,
  index,
  defaultIndex = 0,
  onIndexChange,
  aspectRatio = 1,
  height,
  contentFit = 'cover',
  cachePolicy = 'memory-disk',
  radius = 'lg',
  showIndicators = true,
  accessibilityLabel,
  style,
  testID,
}: AppImageGalleryProps) => (
  <AppCarousel
    items={items}
    keyExtractor={(
      item,
    ) => item.id}
    index={index}
    defaultIndex={
      defaultIndex
    }
    onIndexChange={
      onIndexChange
    }
    aspectRatio={
      aspectRatio
    }
    height={height}
    showIndicators={
      showIndicators
    }
    accessibilityLabel={
      accessibilityLabel
    }
    style={style}
    testID={testID}
    renderItem={(
      item,
    ) => (
      <AppImage
        source={
          item.source
        }
        placeholder={
          item.placeholder
        }
        contentFit={
          contentFit
        }
        placeholderContentFit={
          contentFit
        }
        cachePolicy={
          cachePolicy
        }
        recyclingKey={
          item.recyclingKey ??
          item.id
        }
        radius={radius}
        decorative={
          !item.accessibilityLabel
        }
        accessibilityLabel={
          item.accessibilityLabel
        }
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    )}
  />
);
