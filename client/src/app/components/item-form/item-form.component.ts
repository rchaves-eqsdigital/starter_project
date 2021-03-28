import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Logging } from 'src/app/logging/logging';
import { ApiService } from '../../api.service';
import { Item } from '../../data-structs/item';

/**
 * Generic form to edit an Item. Only supports one field (body text) at the moment.
 */
@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  /**
   * Item to be edited.
   */
  @Input()
  item: Item;

  /**
   * Type of the Item, as a string.
   */
  @Input()
  type: string;

  /**
   * ID of the Item to be edited.
   */
  @Input()
  id: string;

  /**
   * Textbox with the new data to be saved.
   */
  @ViewChild("textbox")
  value: ElementRef;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.initModal();
  }

  /**
   * Setup the modal that is shown when then "Edit" button is clicked.
   */
  private initModal(): void {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("btn");

    // Get the <span> element that closes the modal
    var span = document.getElementById("close");

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    } 
  }

  /**
   * Form submission function. Sends edit request to the API.
   */
  public async formClick(): Promise<void> {
    let data = this.value.nativeElement.value; // TODO: do this with JSON ({fieldToEdit: newValue})
    Logging.log(data);
    if (data.length == 0) {
      alert("Invalid text.");
      return;
    }
    let payload = {'id':this.id,'data':data};
    await this.apiService.edit(this.type,JSON.stringify(payload));
    alert("Saved! Refresh page to see the changes."); // TODO: Updated field on screen when it's changed.
    document.getElementById("myModal").style.display = "none";
  }
}