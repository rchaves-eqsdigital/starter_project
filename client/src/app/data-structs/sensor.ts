import { Item } from './item';

export class Sensor implements Item {
    private Pic: String; // Base64 Encoded
    private Name: String;
    private Body: String;

    constructor(pic: String, name: String, body: String="regular sensor") {
        if (pic === null) {
            this.Pic = "";
        } else {
            this.Pic = pic;
        }
        this.Name = name;
        this.Body = body;
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
        return this.getName();
    }

    /**
     * getTitle
     */
    public getBody(): String {
        return this.Body;
    }

    /**
     * getID
     */
    public getID(): String {
        return this.getName();
    }
}