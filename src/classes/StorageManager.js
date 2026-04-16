import { getWorkDataFromURL } from "../utils.js";

export default class StorageManager{
    async get(){
        const { bookmarks } = await chrome.storage.local.get("bookmarks");
        return { bookmarks };
    }
    async getBookmark(){
        const { bookmarks } = await this.get();
        const { workNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
        const bookmarkByPage = bookmarks[workNumber];
        //const bookmarkByPage = bookmarks ? bookmarks[workNumber] : 
        return { bookmarkByPage, pageChapterNumber };
    }
    set(workNumber, bookmarkByPage){    
        chrome.storage.local.get("bookmarks", (result) => {
            let bookmarks = result.bookmarks || {};

            console.log(`typeof workNumber: ${typeof workNumber}`);

            bookmarks[workNumber] = bookmarkByPage;
        
            chrome.storage.local.set({ bookmarks: bookmarks });
        });
    }
    remove(workNumber){    
        chrome.storage.local.get("bookmarks", (result) => {
            //const { workNumber } = getWorkDataFromURL(window.location.href);

            let bookmarks = result.bookmarks || {};

            delete bookmarks[workNumber];

            chrome.storage.local.set(result);
        });
    }
}