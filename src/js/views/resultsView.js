import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js'
class ResultsView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found, please try again';
  _message = '';
    _generateMarkup(){
        // console.log(this._data);
        return this._data.map(results => previewView.render(results,false)).join('');
    }
    

}
export default new ResultsView();