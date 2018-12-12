import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../services/data.service';
import { Surveillance } from '../interfaces/surveillance';

@Component({
  selector: 'app-view-rules',
  templateUrl: './view-rules.component.html',
  styleUrls: ['./view-rules.component.scss']
})
export class ViewRulesComponent implements OnInit {
	private id: string;
	surveillance: any = {};
  private hasRules: boolean = false;
  metadataRules: Array<any> = [];
  contentRules: Array<any> = [];
  private allSelected: boolean = false;
  private isDraft: boolean = false;

  searchString: string = '';

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit() {
  	this.id = this.route.snapshot.paramMap.get('id');
  	this.isDraft = (this.route.snapshot.paramMap.get('type')) ? true : false;
    this.dataService.getSurveillanceDetails(this.id, this.isDraft)
      .subscribe(data => {
        this.surveillance = data.data;
        if (this.surveillance.rules.length) {
          this.hasRules = true;
          this.surveillance.rules.forEach((r) => {
          	console.log(r);
            r.showString = false;
            r.isSelected = false;
            if (r.ruleType.toLowerCase() === 'metadata') {
              this.metadataRules.push(r);
            } else {
              this.contentRules.push(r);
            }
          });
        }
      });
  }

  toggleAllRules(e: Event) {
    e.preventDefault();
    this.metadataRules.forEach((r) => {
      r.isSelected = !r.isSelected;
    });
    this.contentRules.forEach((r) => {
      r.isSelected = !r.isSelected;
    });
    this.allSelected = !this.allSelected;
  }

  capitalize(str: any): String {
    if (!str) {
      return str;
    }
    return `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;
  }

  navigate(rule_id: String) {
    this.router.navigate(['rule', this.id, rule_id, this.isDraft])
  }

  capitalizeArray(arr: Array<String>) {
    if (!(arr instanceof Array)) {
      return arr;
    }

    return arr.map(each_string => this.capitalize(each_string));
  }

  doSearch(e: any) {
    if (this.surveillance.rules.length == 0) {
      return;
    }

    e = e.trim().toLowerCase();

    let displayedList = this.surveillance.rules.filter(current_obj => current_obj.name.toLowerCase().search(e) > -1 || current_obj.rule.toLowerCase().search(e) > -1);

    if (displayedList.length === 0) {
      return;
    }

    this.metadataRules = [];
    this.contentRules = [];
    displayedList.forEach(element => {
      if (element.ruleType.toLowerCase() === 'metadata') {
        this.metadataRules.push(element);
      } else {
        this.contentRules.push(element);
      }
    });
  }

  isRuleSelected() {
    const len = this.surveillance.rules.length;
    let i = 0;
    for (let i = 0; i < len; i++) {
      if (this.surveillance.rules[i].isSelected) {
        return true;
      }
    }
    return false;
  }

  testRules() {
    let str = '';
    this.surveillance.rules.forEach((r) => {
      if (r.isSelected) {
        str += (str === '') ? r.id : ',' + r.id;
      }
    });
    this.router.navigate(['/rule-results', str]);
  }

}
