import {SyneriseProductGalleryProps} from "../SyneriseProductGallery";

function getSorting(key: string, options: SyneriseProductGalleryProps['sort']){
    return options.find(item => item.key === key)
        || options.find(item => item.isDefault)
        || options[0]
        || undefined;
}

export default getSorting
