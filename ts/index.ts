export class IndexPage {
  public init() {
    const outputNode = document.getElementById('output');
    if (null == outputNode) throw new Error('Could not find output node.');
    
    const productCard = document.createElement('div');
    productCard.innerHTML = 'Product Card';
    
    outputNode.appendChild(productCard);
  }
}
