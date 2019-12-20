import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
import {
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
} from './popular';
import {
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';
import {onSearch, onSearchCancel, onLoadMoreSearch} from './search';
export default {
  onThemeChange,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage,
  onShowCustomThemeView,
  onThemeInit,
  onSearch,
  onSearchCancel,
  onLoadMoreSearch,
};
