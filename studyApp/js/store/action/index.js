import {onThemeColorChange} from './theme';
import {
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
} from './popular';
import {onRefreshTrending, onLoadMoreTrending} from './trending';
import {onLoadFavoriteData} from '../action/favorite';
export default {
  onThemeColorChange,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
};
