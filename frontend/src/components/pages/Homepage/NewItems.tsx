import "./Home.css";

interface Newitem {
  name: string;
  sold: number;
  price: number;
}

const newItemsData: Newitem[] = [
  {
    name: "Female Uniform From KMUTT Fear of Natacha 2nd hand",
    sold: 20,
    price: 1590,
  },
  {
    name: "ECO is the best",
    sold: 10,
    price: 9999,
  },
];

const NewItems = () => {
  return (
    <div className="Home__New__Item__Container">
      <div className="NewItem__Button__Container"></div>
      <div className="Home__New__Item__Box">
        {newItemsData.map((item) => (
          <div className="Home__New__Item" key={item.name}>
            <div className="Home__New__Item__Name">{item.name}</div>
            <div className="Home__New__Item__Sold">{item.sold} Sold</div>
            <div className="Home__New__Item__Price">{item.price} Baht</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewItems;
