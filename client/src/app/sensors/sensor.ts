import { Item } from '../item-list/item';

export class Sensor implements Item {
    private Pic: String; // Base64 Encoded
    private Name: String;

    constructor(pic: String, name: String) {
        this.Pic = pic;
        this.Name = name;
    }

    /**
     * getPic
     */
    public getPic(): String {
        return this.Pic;
    }

    /**
     * getName
     */
    public getName(): String {
        return this.Name;
    }

    /*** Item interface implementations ***/
    /**
     * getTitle
     */
    public getTitle(): String {
        return this.getName()
    }

    /**
     * getTitle
     */
    public getBody(): String {
        return "regular sensor"
    }
}