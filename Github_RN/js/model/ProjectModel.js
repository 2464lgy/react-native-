/**
 *带收藏状态的item
 * @param {*} item
 * @param {*} isFavorite
 */

export default function ProjectModel(item, isFavorite) {
  this.item = item;
  this.isFavorite = isFavorite;
}
