import { Item } from './item';

/**
 * User class, is also an Item.
 */
export class User implements Item {
    private Pic: String; // Base64 Encoded
    private Name: String;
    private Email: String;
    private ID: String;

    /**
     * Constructor.
     * 
     * @param pic - User pic, Base64 encoded.
     * @param name - User name.
     * @param email - User email.
     * @param id - User ID, as stored in the DB.
     */
    constructor(pic: String, name: String, email: String, id: String) {
        this.Pic = pic;
        this.Name = name;
        this.Email = email;
        this.ID = id;
    }

    /**
     * `this.Pic` getter.
     */
    public getPic(): String {
        return this.Pic === null ? "" : this.Pic;
    }

    /*
    // TS getters and setters
    public get Pic2(): String {
        return this.Pic;
    }

    public set Pic2(x: String) {
        this.Pic = x;
    }
    */

    /**
     * `this.Name` getter.
     */
    public getName(): String {
        return this.Name;
    }

    /**
     * `this.Email` getter.
     */
    public getEmail(): String {
        return this.Email;
    }

    /**
     * @implements Item
     * @returns Name String.
     */
    public getTitle(): String {
        return this.getName()
    }

    /**
     * @implements Item
     * @returns Email string.
     */
    public getBody(): String {
        return this.getEmail()
    }

    /**
     * @implements Item
     * @returns ID string.
     */
    public getID(): String {
        return this.ID;
    }
}