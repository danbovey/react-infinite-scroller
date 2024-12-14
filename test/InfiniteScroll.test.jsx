import * as React from 'react';
import { render } from '@testing-library/react';
import InfiniteScroll from '../src/InfiniteScroll';

describe('InfiniteScroll component', () => {
  it('should render', () => {
    const loadMore = jest.fn();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );

    const { container } = render(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>,
    );
    expect(container.querySelectorAll('.child-class').length).toBe(3);
  });

  it('should render componentDidMount', () => {
    const spy = jest.spyOn(InfiniteScroll.prototype, 'componentDidMount');
    const loadMore = jest.fn();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    render(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>,
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should attach scroll listeners', () => {
    const attachScrollListenerSpy = jest.spyOn(
      InfiniteScroll.prototype,
      'attachScrollListener',
    );
    const scrollListenerSpy = jest.spyOn(
      InfiniteScroll.prototype,
      'scrollListener',
    );
    const loadMore = jest.fn();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    render(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore
          useWindow={false}
          threshold={0}
        >
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>,
    );
    expect(attachScrollListenerSpy).toHaveBeenCalledTimes(1);
    expect(scrollListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle when the scrollElement is removed from the DOM', () => {
    const componentRef = React.createRef();

    const loadMore = jest.fn();

    const { container } = render(
      <div>
        <InfiniteScroll
          ref={componentRef}
          pageStart={0}
          loadMore={loadMore}
          hasMore={false}
        >
          <div className="child-component">Child Text</div>
        </InfiniteScroll>
      </div>,
    );

    // The component has now mounted, but the scrollComponent is null
    componentRef.current.scrollComponent = null;

    // Invoke the scroll listener which depends on the scrollComponent to
    // verify it executes properly, and safely navigates when the
    // scrollComponent is null.
    componentRef.current.scrollListener();

    expect(container.textContent).toBe('Child Text');
  });
});
