import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import renderer from 'react-test-render';
import App, {Search} from './App';


describe ('App', ()=>{

  it('Отрисовывает без ошибки', ()=>{
const div=document.createElement('div');
ReactDOM.render(<App/>,div);
ReactDOM.unmountComponentAtNode(div);
});
});

test('есть конкркетный снимок', ()=>{
  const component = render.create(
    <App/>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
describe ('Serach', ()=>{

  it('Отрисовывает без ошибки', ()=>{
const div=document.createElement('div');
ReactDOM.render(<Search>Поиск</Search>,div);
ReactDOM.unmountComponentAtNode(div);
});
});

test('есть конкркетный снимок', ()=>{
  const component = render.create(
    <Search>Поиск</Search>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

