import { Component, AfterContentInit,ContentChildren,QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs:QueryList<TabComponent>=new QueryList()
  ngAfterContentInit(): void {
const activeTabs=this.tabs?.filter(tab=> tab.active)
if (!activeTabs||activeTabs.length===0){
  this.selectTab(this.tabs!.first)
}
  }
  selectTab(tab:TabComponent){
    this.tabs?.forEach(tab=>{tab.active=false})
    tab.active=true
    return false //to prevent the default behavior of redirection to a new page

  }
setClass(tab:TabComponent){
  const classes={'bg-indigo-400 text-white hover:text-white': tab.active,
  'hover:text-indigo-400':!tab.active
}
return classes

}


}
