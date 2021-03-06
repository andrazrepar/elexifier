import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransformationApiService } from '@elexifier/dictionaries/core/transformation-api.service';

@Component({
  selector: 'app-create-transformation',
  templateUrl: './create-transformation.component.html',
  styleUrls: ['./create-transformation.component.scss'],
})
export class CreateTransformationComponent implements OnInit {
  public configurations = [];
  public createTransformationFormGroup: FormGroup;
  public ENTRY_ELEMENT_TOOLTIP_TEXT = 'Select the XML element used to denote entries in your dictionary.';
  public existingConfigurations: SelectItem[] = [];
  public HEADWORD_ELEMENT_TOOLTIP_TEXT = 'Select the XML element used to denote headwords in your dictionary.';
  @Output() public ready: EventEmitter<FormGroup>;
  @Input() public showErrors: boolean;
  public TRANSFORMATION_NAME_TOOLTIP_TEXT = `Select a name for this transformation.
  You will be able to create additional transformations later.`;

  public constructor(
    private fb: FormBuilder,
    private transformationApiService: TransformationApiService,
  ) {
    this.ready = new EventEmitter<FormGroup>(true);
  }

  public ngOnInit() {
    this.createTransformationFormGroup = this.fb.group({
      entry_spec: ['', Validators.required],
      hw: [''],
      xfname: ['', Validators.required],
    });

    this.transformationApiService.getSavedConfigurations()
      .subscribe((configurations) => {
        this.configurations = configurations;

        this.existingConfigurations = this.configurations.map(c => {
          return {
            label: c.name,
            value: {
              id: c.id,
              entry_spec: c.entity_spec,
            },
          };
        });
      });

    this.ready.emit(this.createTransformationFormGroup);
  }
}
