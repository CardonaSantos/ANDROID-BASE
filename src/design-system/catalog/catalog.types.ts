export type DesignSystemFamily =
  | 'primitives'
  | 'layout'
  | 'actions'
  | 'forms'
  | 'data-display'
  | 'feedback'
  | 'states'
  | 'overlays'
  | 'navigation'
  | 'collections'
  | 'media';

export interface DesignSystemCatalogEntry {
  name: string;
  family:
    DesignSystemFamily;
}
