import { View, IViewEngine } from '../view/view-engine';

export class ProductCard {
  constructor(private viewEngine: IViewEngine) {
    // using dependency injection for the view engine
  }
  
  public output(): Promise<Element> {
    return new Promise<Element>((success, error) => {
      this.viewEngine.get('/js/modules/product-card/view.html', { name: 'Test' })
        .then((view: View) => {
          // View is just an abstraction of a Node Element.
          success(view);
        })
        .catch(error);
    });
  }
}
