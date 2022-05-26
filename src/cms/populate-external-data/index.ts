import type { CMSList } from '../../types/CMSList';
import type { Product } from './types';
var Airtable = require('airtable');
 
/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances: CMSList[]) => {

    // Get the list instance
    const [ listInstance ] = listInstances;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const products = await fetchProducts();

    // Remove existing items
    listInstance.clearItems();

    const newItems = products.map((product) => {
      return createItem(product, itemTemplateElement)
    })
    // Populate the list

    await listInstance.addItems(newItems);
  },
]);

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */
const fetchProducts = async () => {
  return new Promise((resolve, reject) => {
    var base = new Airtable({ apiKey: 'keyVaqaXzXRDSsa31' }).base('app6CABYWEh8dxlQd');
    let data: Product[] = [];

    base('Product Details').select({
      view: "Grid view"
    })
      .eachPage(function page(records: any[], fetchNextPage: any) {
        try {
          records.forEach(function (record: any) {
            
            let image = ""
            try {
              image = record.get('Product Image')[0].url
            } catch(error) {
            }

            const item: Product = {
              partNumber: record?.get('Part Number')??" ",
              description: record?.get('Description')?? " ",
              productCategory: record?.get('Product Category')?? " ",
              productSegment: record?.get('Product Segment')?? " ",
              ampRating: record?.get('Amp Rating')?? " ",
              voltage: record?.get('Voltage')?? " ",
              characteristics: record?.get('Characteristics')?? " ",
              size: record?.get('Size')?? " ",
              individualDatasheet: record?.get('Individual Datasheet')?? " ",
              sectionDatasheet: record?.get('Section Datasheet')?? " ",
              image: image,
              crossRefrence: record?.get('Cross Reference Numbers')?? " ",
            };
            console.log(item.productCategory,item.productSegment);

            data.push(item);
          });
        } catch (e) { console.log('error inside eachPage => ', e) }
        fetchNextPage();
      }, function done(err: any) {
        if (err) {
          console.error(err);
          reject(err)
        }
        resolve(data)
      })
  })
};

/**
 * Creates an item from the template element.
 * @param product The product data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (product: Product, templateElement: HTMLDivElement) => {

  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="image"]');
  const sectionDatasheet = newItem.querySelector<HTMLAnchorElement>('[data-element="section datasheet"]');
  const individualDatasheet = newItem.querySelector<HTMLAnchorElement>('[data-element="individual datasheet"]');
  const partNumber = newItem.querySelector<HTMLDivElement>('[data-element="part number"]');
  const productCategory = newItem.querySelector<HTMLParagraphElement>('[data-element="category"]');
  const productSegment = newItem.querySelector<HTMLParagraphElement>('[data-element="segment"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const ampRating = newItem.querySelector<HTMLParagraphElement>('[data-element="amp rating"]');
  const voltage = newItem.querySelector<HTMLParagraphElement>('[data-element="voltage"]');
  const characteristics = newItem.querySelector<HTMLParagraphElement>('[data-element="characteristics"]');
  const size = newItem.querySelector<HTMLParagraphElement>('[data-element="size"]');
  const cxr = newItem.querySelector<HTMLParagraphElement>('[data-element="cxr"]');

  // Populate inner elements
  if (image) image.src = product.image;
  if (individualDatasheet) individualDatasheet.href = product.individualDatasheet;
  if (sectionDatasheet) sectionDatasheet.href = product.sectionDatasheet;
  if (partNumber) partNumber.textContent = product.partNumber;
  if (productCategory) productCategory.textContent = product.productCategory;
  if (productSegment) productSegment.textContent = product.productSegment;
  if (description) description.textContent = product.description;
  if (ampRating) ampRating.textContent = product.ampRating;
  if (voltage) voltage.textContent = product.voltage;
  if (characteristics) characteristics.textContent = product.characteristics;
  if (size) size.textContent = product.size;
  if (cxr) cxr.textContent = product.crossRefrence;

  return newItem;
};


