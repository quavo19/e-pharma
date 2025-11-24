import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, MapPin, Phone, Mail } from 'lucide-angular';
import { Supplier } from '../../../pages/suppliers/suppliers.component';

@Component({
  selector: 'app-supplier-details',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './supplier-details.component.html',
})
export class SupplierDetailsComponent {
  supplier = input.required<Supplier>();

  public readonly icons = {
    Globe,
    MapPin,
    Phone,
    Mail,
  };
}

