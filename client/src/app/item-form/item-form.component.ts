import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Item } from '../item-list/item';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  @Input()
  public item: Item;

  constructor() { }

  ngOnInit(): void {
    this.initModal();
  }

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

  public formClick(): void {
    alert("Saved!");
    document.getElementById("myModal").style.display = "none";
    // TODO: Save
  }
}

/*
var readonly = true;
$('.example input[type="button"]').on('click', function() {
    $('.example input[type="text"]').attr('readonly', !readonly);

    readonly = !readonly;
    $('.example input[type="button"]').val( readonly ? 'Edit' : 'Save' );
    return false;
});
*/