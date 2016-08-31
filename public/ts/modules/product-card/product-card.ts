import { View, IViewEngine } from '../view/view-engine';

export class ProductCard {
  constructor(private viewEngine: IViewEngine) {
    // using dependency injection for the view engine
  }
}
