/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.1.
 ** Copyright (c) 2000-2019 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
'use strict'

define(['yfiles/view-component'], /** @type {yfiles_namespace} */ /** typeof yfiles */ yfiles => {
  /**
   * A simple IArrow implementation that renders the arrow as a custom filled shape.
   * @implements {yfiles.styles.IArrow}
   * @implements {yfiles.view.IVisualCreator}
   * @implements {yfiles.view.IBoundsProvider}
   */
  class MySimpleArrow extends yfiles.lang.Class(
    yfiles.styles.IArrow,
    yfiles.view.IVisualCreator,
    yfiles.view.IBoundsProvider
  ) {
    /**
     * Initializes a new instance of the {@link MySimpleArrow} class.
     */
    constructor() {
      super()
      this.anchor = yfiles.geometry.Point.ORIGIN
      this.direction = yfiles.geometry.Point.ORIGIN
      this.$thickness = 2.0
      this.arrowThickness = 0
      this.$arrowFigure = null
    }

    get arrowFigure() {
      return this.$arrowFigure
    }

    set arrowFigure(value) {
      this.$arrowFigure = value
    }

    /**
     * Returns the length of the arrow, i.e. the distance from the arrow's tip to
     * the position where the visual representation of the edge's path should begin.
     * Value: Always returns 7
     * @see Specified by {@link yfiles.styles.IArrow#length}.
     * @type {number}
     */
    get length() {
      return 7
    }

    /**
     * Gets the cropping length associated with this instance.
     * Value: Always returns 1
     * This value is used by {@link yfiles.styles.IEdgeStyle}s to let the
     * edge appear to end shortly before its actual target.
     * @see Specified by {@link yfiles.styles.IArrow#cropLength}.
     * @type {number}
     */
    get cropLength() {
      return 1
    }

    /**
     * Gets or sets the thickness of the arrow.
     * @type {number}
     */
    get thickness() {
      return this.$thickness
    }

    /**
     * Gets or sets the thickness of the arrow.
     * @param {number} value
     */
    set thickness(value) {
      this.$thickness = value
    }

    /**
     * Gets an {@link yfiles.view.IVisualCreator} implementation that will create
     * the {@link yfiles.view.IVisualCreator} for this arrow
     * at the given location using the given direction for the given edge.
     * @param {yfiles.graph.IEdge} edge the edge this arrow belongs to
     * @param {boolean} atSource whether this will be the source arrow
     * @param {yfiles.geometry.Point} anchor the anchor point for the tip of the arrow
     * @param {yfiles.geometry.Point} direction the direction the arrow is pointing in
     * @return {yfiles.view.IVisualCreator}
     * Itself as a flyweight.
     * @see Specified by {@link yfiles.styles.IArrow#getVisualCreator}.
     */
    getVisualCreator(edge, atSource, anchor, direction) {
      this.configureThickness(edge)
      this.anchor = anchor
      this.direction = direction
      return this
    }

    /**
     * Gets an {@link yfiles.view.IBoundsProvider} implementation that can yield
     * this arrow's bounds if painted at the given location using the
     * given direction for the given edge.
     * @param {yfiles.graph.IEdge} edge the edge this arrow belongs to
     * @param {boolean} atSource whether this will be the source arrow
     * @param {yfiles.geometry.Point} anchor the anchor point for the tip of the arrow
     * @param {yfiles.geometry.Point} direction the direction the arrow is pointing in
     * @return {yfiles.view.IBoundsProvider}
     * an implementation of the {@link yfiles.view.IBoundsProvider} interface that can
     * subsequently be used to query the bounds. Clients will always call
     * this method before using the implementation and may not cache the instance returned.
     * This allows for applying the flyweight design pattern to implementations.
     * @see Specified by {@link yfiles.styles.IArrow#getBoundsProvider}.
     */
    getBoundsProvider(edge, atSource, anchor, direction) {
      // Get the edge's thickness
      const style = edge.style
      if (typeof style.pathThickness !== 'undefined') {
        this.arrowThickness = style.pathThickness
      } else {
        this.arrowThickness = this.thickness
      }

      this.anchor = anchor
      this.direction = direction
      return this
    }

    /**
     * Creates the visual for the arrow.
     * @param {yfiles.view.IRenderContext} context The context that contains the information needed to create the
     *   visual.
     * @return {yfiles.view.SvgVisual}
     * The arrow visual.
     * @see Specified by {@link yfiles.view.IVisualCreator#createVisual}.
     */
    createVisual(context) {
      // create a new path to draw the arrow
      if (this.arrowFigure === null) {
        this.arrowFigure = new yfiles.geometry.GeneralPath()
        this.arrowFigure.moveTo(new yfiles.geometry.Point(7, -this.arrowThickness / 2))
        this.arrowFigure.lineTo(new yfiles.geometry.Point(7, this.arrowThickness / 2))
        this.arrowFigure.cubicTo(
          new yfiles.geometry.Point(5, this.arrowThickness / 2),
          new yfiles.geometry.Point(1.5, this.arrowThickness / 2),
          new yfiles.geometry.Point(-1, this.arrowThickness * 1.666)
        )
        this.arrowFigure.cubicTo(
          new yfiles.geometry.Point(0, this.arrowThickness * 0.833),
          new yfiles.geometry.Point(0, -this.arrowThickness * 0.833),
          new yfiles.geometry.Point(-1, -this.arrowThickness * 1.666)
        )
        this.arrowFigure.cubicTo(
          new yfiles.geometry.Point(1.5, -this.arrowThickness / 2),
          new yfiles.geometry.Point(5, -this.arrowThickness / 2),
          new yfiles.geometry.Point(7, -this.arrowThickness / 2)
        )
        this.arrowFigure.close()
      }

      const path = this.arrowFigure.createSvgPath()

      // add the gradient to the global defs section if necessary and returns the id
      const gradientId = context.getDefsId(GRADIENT)
      path.setAttribute('fill', `url(#${gradientId})`)

      // Remember thickness for update
      path['data-renderDataCache'] = this.arrowThickness

      // rotate the arrow and move it to correct position
      path.setAttribute(
        'transform',
        `matrix(${-this.direction.x} ${-this.direction.y} ${this.direction.y} ${-this.direction
          .x} ${this.anchor.x} ${this.anchor.y})`
      )

      return new yfiles.view.SvgVisual(path)
    }

    /**
     * This method updates or replaces a previously created {@link yfiles.view.Visual}.
     * The {@link yfiles.view.CanvasComponent} uses this method to give implementations a chance to
     * update an existing Visual that has previously been created by the same instance during a call
     * to {@link MySimpleArrow#createVisual}. Implementations may update the <code>oldVisual</code>
     * and return that same reference, or create a new visual and return the new instance or <code>null</code>.
     * @param {yfiles.view.IRenderContext} context The context that contains the information needed to create the
     *   visual.
     * @param {yfiles.view.SvgVisual} oldVisual The visual instance that had been returned the last time the
     *   {@link MySimpleArrow#createVisual} method was called.
     * @return {yfiles.view.SvgVisual}
     * The updated visual.
     * @see {@link MySimpleArrow#createVisual}
     * @see {@link yfiles.view.ICanvasObjectDescriptor}
     * @see {@link yfiles.view.CanvasComponent}
     * @see Specified by {@link yfiles.view.IVisualCreator#updateVisual}.
     */
    updateVisual(context, oldVisual) {
      const path = oldVisual.svgElement
      // get thickness of old arrow
      const oldThickness = path['data-renderDataCache']
      // if thickness has changed
      if (oldThickness !== this.arrowThickness) {
        // re-render arrow
        return this.createVisual(context)
      }

      path.setAttribute(
        'transform',
        `matrix(${-this.direction.x} ${-this.direction.y} ${this.direction.y} ${-this.direction
          .x} ${this.anchor.x} ${this.anchor.y})`
      )
      return oldVisual
    }

    /**
     * Returns the bounds of the arrow for the current flyweight configuration.
     * @see Specified by {@link yfiles.view.IBoundsProvider#getBounds}.
     * @return {yfiles.geometry.Rect}
     */
    getBounds(context) {
      return new yfiles.geometry.Rect(
        this.anchor.x - 8 - this.arrowThickness,
        this.anchor.y - 8 - this.arrowThickness,
        16 + this.arrowThickness * 2,
        16 + this.arrowThickness * 2
      )
    }

    /**
     * Configures the thickness to use for the next visual creation.
     * @param {yfiles.graph.IEdge} edge The edge to read the thickness from.
     */
    configureThickness(edge) {
      // Get the edge's thickness
      const oldThickness = this.arrowThickness
      const style = edge.style
      if (typeof style.pathThickness !== 'undefined') {
        this.arrowThickness = style.pathThickness
      } else {
        this.arrowThickness = this.thickness
      }
      // see if the old arrow figure needs to be invalidated...
      if (this.arrowThickness !== oldThickness) {
        this.arrowFigure = null
      }
    }
  }

  /**
   * This class is needed in order to support automatic cleanup of the global defs section.
   * The SVG specification requires gradient elements to be put into a defs section. The
   * element using the gradient merely references it in it's fill or stroke attribute.
   * Class {@link yfiles.view.SvgDefsManager} has the task of managing the entities stored in the
   * SVG's global defs section. This includes putting entities into and cleaning the defs
   * section every once in a while. In order for {@link yfiles.view.SvgDefsManager} to interact with
   * the defs elements, those have to implement {@link yfiles.view.ISvgDefsCreator} that offers a
   * defined interface to deal with.
   * @implements {yfiles.view.ISvgDefsCreator}
   */
  class MyGradientSupport extends yfiles.lang.Class(yfiles.view.ISvgDefsCreator) {
    constructor(gradient) {
      super()
      this.gradient = gradient
    }

    /** @return {SVGElement} */
    createDefsElement(context) {
      return this.gradient
    }

    /** @return {boolean} */
    accept(context, node, id) {
      const element = node instanceof Element ? node : null
      if (element !== null) {
        const attributeValue = element.getAttribute('fill')
        return attributeValue !== null && attributeValue === `url(#${id})`
      }
      return false
    }

    updateDefsElement(context, oldElement) {}
  }

  const GRADIENT = createGradient()

  /**
   * @return {MyGradientSupport}
   */
  function createGradient() {
    // initialize gradient
    const linearGradient = window.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'linearGradient'
    )
    linearGradient.setAttribute('x1', 0)
    linearGradient.setAttribute('y1', 0)
    linearGradient.setAttribute('x2', 0)
    linearGradient.setAttribute('y2', 1)
    linearGradient.setAttribute('spreadMethod', 'repeat')
    const stop1 = window.document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('stop-color', 'rgb(180,180,180)')
    stop1.setAttribute('stop-opacity', '1')
    stop1.setAttribute('offset', '0')
    linearGradient.appendChild(stop1)
    const stop2 = window.document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('stop-color', 'rgb(50,50,50)')
    stop2.setAttribute('stop-opacity', '1')
    stop2.setAttribute('offset', '0.5')
    linearGradient.appendChild(stop2)
    const stop3 = window.document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop3.setAttribute('stop-color', 'rgb(150,150,150)')
    stop3.setAttribute('stop-opacity', '1')
    stop3.setAttribute('offset', '1')
    linearGradient.appendChild(stop3)

    // initialize gradient support
    // This mechanism is needed to allow sharing of gradient instances between
    // multiple svg elements, as well as automatic cleanup of the global defs section.
    return new MyGradientSupport(linearGradient)
  }

  return MySimpleArrow
})
