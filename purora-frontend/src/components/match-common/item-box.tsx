import {CDN_HOST} from "@utils/constants";
import ToolTip from "@components/tooltip/tooltip";

interface ItemBoxProps {
  className: string;
  version: string;
  item: number;
  itemData: any;
}

const ItemBoxComponent: React.FC<ItemBoxProps> = (
  {
    className,
    version,
    item,
    itemData,
  }
) => {

  return (
    <div className={`${className} bg-gray-300 rounded-md`}>
      { item !== 0 && (
        <div className={'w-full h-full tooltip-box'}>
          <img
            className={'rounded-md'}
            src={`${CDN_HOST}/${version}/img/item/${item}.png`}
          />
          <ToolTip>
            <div className={'text-xs md:text-sm text-yellow-400'}>{ itemData.name } { itemData.gold.total }G</div>
            <div className={'text-2xs md:text-xs'}>{ itemData.plaintext }</div>
          </ToolTip>
        </div>
      )}
    </div>
  )
}

export default ItemBoxComponent;