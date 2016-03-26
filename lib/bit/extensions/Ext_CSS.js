(function(){
    $.fn.css = function(styles) {
      
        var _self = this;

        // CSS2Properties
        if (styles) {

            // if (styles.background)
            _self.div.style.background              = styles.background;

            // if (styles.backgroundAttachment)
            _self.div.style.backgroundAttachment    = styles.backgroundAttachment;

            // if (styles.backgroundBlendMode)
            _self.div.style.backgroundBlendMode     = styles.backgroundBlendMode;

            // if (styles.backgroundClip)
            _self.div.style.backgroundClip          = styles.backgroundClip;

            // if (styles.backgroundColor)
            _self.div.style.backgroundColor         = styles.backgroundColor;

            _self.div.style.backgroundImage         = styles.backgroundImage;
            _self.div.style.backgroundOrigin        = styles.backgroundOrigin;
            _self.div.style.backgroundPosition      = styles.backgroundPosition;
            _self.div.style.backgroundRepeat        = styles.backgroundRepeat;
            _self.div.style.backgroundSize          = styles.backgroundSize;
            _self.div.style.border                  = styles.border;
            _self.div.style.borderBottom            = styles.borderBottom;
            _self.div.style.borderBottomColor       = styles.borderBottomColor;
            _self.div.style.borderBottomLeftRadius  = styles.borderBottomLeftRadius;
            _self.div.style.borderBottomRightRadius = styles.borderBottomRightRadius;
            _self.div.style.borderBottomStyle       = styles.borderBottomStyle;
            _self.div.style.borderBottomWidth       = styles.borderBottomWidth;
            _self.div.style.borderCollapse          = styles.borderCollapse;
            _self.div.style.borderColor             = styles.borderColor;
            _self.div.style.borderImage             = styles.borderImage;
            _self.div.style.borderImageOutset       = styles.borderImageOutset;
            _self.div.style.borderImageRepeat       = styles.borderImageRepeat;
            _self.div.style.borderImageSlice        = styles.borderImageSlice;
            _self.div.style.borderImageSource       = styles.borderImageSource;
            _self.div.style.borderImageWidth        = styles.borderImageWidth;
            _self.div.style.borderLeft              = styles.borderLeft;
            _self.div.style.borderLeftColor         = styles.borderLeftColor;
            _self.div.style.borderLeftStyle         = styles.borderLeftStyle;
            _self.div.style.borderLeftWidth         = styles.borderLeftWidth;
            _self.div.style.borderRadius            = styles.borderRadius;
            _self.div.style.borderRight             = styles.borderRight;
            _self.div.style.borderRightColor        = styles.borderRightColor;
            _self.div.style.borderRightStyle        = styles.borderRightStyle;
            _self.div.style.borderRightWidth        = styles.borderRightWidth;
            _self.div.style.borderSpacing           = styles.borderSpacing;
            _self.div.style.borderStyle             = styles.borderStyle;
            _self.div.style.borderTop               = styles.borderTop;
            _self.div.style.borderTopColor          = styles.borderTopColor;
            _self.div.style.borderTopLeftRadius     = styles.borderTopLeftRadius;
            _self.div.style.borderTopRightRadius    = styles.borderTopRightRadius;
            _self.div.style.borderTopStyle          = styles.borderTopStyle;
            _self.div.style.borderTopWidth          = styles.borderTopWidth;
            _self.div.style.borderWidth             = styles.borderWidth;
            _self.div.style.bottom                  = Utils.convertToPx(styles.bottom);
            _self.div.style.boxDecorationBreak      = styles.boxDecorationBreak;
            _self.div.style.boxShadow               = styles.boxShadow;
            _self.div.style.boxSizing               = styles.boxSizing;
            _self.div.style.captionSide             = styles.captionSide;
            _self.div.style.clear                   = styles.clear;
            _self.div.style.clip                    = styles.clip;
            _self.div.style.clipPath                = styles.clipPath;
            _self.div.style.clipRule                = styles.clipRule;
            _self.div.style.color                   = styles.color;
            _self.div.style.colorInterpolation      = styles.colorInterpolation;
            _self.div.style.colorInterpolationFilters = styles.colorInterpolationFilters;
            if (!Device.browser.ie) {
                  _self.div.style.content                 = styles.content;
            } else if (Device.browser.ie && Device.browser.version > 11) {
                  _self.div.style.content                 = styles.content;
            }
            
            if (styles.counterIncrement) { _self.div.style.counterIncrement = styles.counterIncrement; }

            if (styles.counterReset) { _self.div.style.counterReset = styles.counterReset; }

            _self.div.style.cssFloat                = styles.cssFloat;

            if (styles.cssText) { _self.div.style.cssText = styles.cssText; }

            _self.div.style.cursor                  = styles.cursor;
            _self.div.style.direction               = styles.direction;
            _self.div.style.display                 = styles.display;
            _self.div.style.dominantBaseline        = styles.dominantBaseline;
            _self.div.style.emptyCells              = styles.emptyCells;
            
            // _self.div.style.fill                    = styles.fill;
            if (styles.fill) { _self.div.style.fill = styles.fill; }
            
            _self.div.style.fillOpacity             = styles.fillOpacity;
            _self.div.style.fillRule                = styles.fillRule;
            _self.div.style.filter                  = styles.filter;
            _self.div.style.flex                    = styles.flex;
            _self.div.style.flexBasis               = styles.flexBasis;
            _self.div.style.flexDirection           = styles.flexDirection;
            _self.div.style.flexFlow                = styles.flexFlow;
            _self.div.style.flexGrow                = styles.flexGrow;
            _self.div.style.flexShrink              = styles.flexShrink;
            _self.div.style.flexWrap                = styles.flexWrap;
            _self.div.style.floodColor              = styles.floodColor;
            _self.div.style.floodOpacity            = styles.floodOpacity;
            _self.div.style.font                    = styles.font;

            if (styles.fontFamily) { _self.div.style.fontFamily = styles.fontFamily; }

            _self.div.style.fontSize                = styles.fontSize;
            _self.div.style.fontSizeAdjust          = styles.fontSizeAdjust;
            _self.div.style.fontStretch             = styles.fontStretch;
            _self.div.style.fontStyle               = styles.fontStyle;
            _self.div.style.fontVariant             = styles.fontVariant;
            _self.div.style.fontWeight              = styles.fontWeight;
            _self.div.style.height                  = Utils.convertToPx(styles.height);
            _self.div.style.imageOrientation        = styles.imageOrientation;
            _self.div.style.imageRendering          = styles.imageRendering;
            _self.div.style.imeMode                 = styles.imeMode;
            _self.div.style.justifyContent          = styles.justifyContent;
            _self.div.style.left                    = Utils.convertToPx(styles.left);
            _self.div.style.length                  = styles.length;
            _self.div.style.letterSpacing           = styles.letterSpacing;
            _self.div.style.lightingColor           = styles.lightingColor;
            _self.div.style.lineHeight              = styles.lineHeight;

            if (styles.fontFamily) { _self.div.style.listStyle = styles.listStyle; };

            _self.div.style.listStyleImage          = styles.listStyleImage;
            _self.div.style.listStylePosition       = styles.listStylePosition;

            if (styles.listStyleType) { _self.div.style.listStyleType = styles.listStyleType; };
            
            _self.div.style.margin                  = styles.margin;
            _self.div.style.marginBottom            = styles.marginBottom;
            _self.div.style.marginLeft              = styles.marginLeft;
            _self.div.style.marginRight             = styles.marginRight;
            _self.div.style.marginTop               = styles.marginTop;
            _self.div.style.marker                  = styles.marker;
            _self.div.style.markerEnd               = styles.markerEnd;
            _self.div.style.markerMid               = styles.markerMid;
            _self.div.style.markerOffset            = styles.markerOffset;
            _self.div.style.markerStart             = styles.markerStart;
            _self.div.style.marks                   = styles.marks;
            _self.div.style.mask                    = styles.mask;
            _self.div.style.maxHeight               = styles.maxHeight;
            _self.div.style.maxWidth                = styles.maxWidth;
            _self.div.style.minHeight               = styles.minHeight;
            _self.div.style.minWidth                = styles.minWidth;
            _self.div.style.mixBlendMode            = styles.mixBlendMode;
            _self.div.style.opacity                 = styles.opacity;
            _self.div.style.order                   = styles.order;
            _self.div.style.orphans                 = styles.orphans;
            _self.div.style.outline                 = styles.outline;
            _self.div.style.outlineColor            = styles.outlineColor;
            _self.div.style.outlineOffset           = styles.outlineOffset;
            _self.div.style.outlineStyle            = styles.outlineStyle;
            _self.div.style.outlineWidth            = styles.outlineWidth;
            _self.div.style.overflow                = styles.overflow;
            _self.div.style.overflowX               = styles.overflowX;
            _self.div.style.overflowY               = styles.overflowY;
            _self.div.style.padding                 = styles.padding;
            _self.div.style.paddingBottom           = styles.paddingBottom;
            _self.div.style.paddingLeft             = styles.paddingLeft;
            _self.div.style.paddingRight            = styles.paddingRight;
            _self.div.style.paddingTop              = styles.paddingTop;

            if (styles.page) { _self.div.style.page = styles.page };

            _self.div.style.pageBreakAfter          = styles.pageBreakAfter;
            _self.div.style.pageBreakBefore         = styles.pageBreakBefore;
            _self.div.style.pageBreakInside         = styles.pageBreakInside;
            _self.div.style.paintOrder              = styles.paintOrder;
            _self.div.style.parentRule              = styles.parentRule;
            _self.div.style.perspective             = styles.perspective;
            _self.div.style.perspectiveOrigin       = styles.perspectiveOrigin;
            _self.div.style.pointerEvents           = styles.pointerEvents;
            _self.div.style.position                = styles.position;
            _self.div.style.quotes                  = styles.quotes;
            _self.div.style.resize                  = styles.resize;
            _self.div.style.right                   = Utils.convertToPx(styles.right);
            _self.div.style.shapeRendering          = styles.shapeRendering;
            _self.div.style.size                    = styles.size;
            _self.div.style.stopColor               = styles.stopColor;
            _self.div.style.stopOpacity             = styles.stopOpacity;
            
            if (styles.stroke) { _self.div.style.stroke = styles.stroke };

            _self.div.style.strokeDasharray         = styles.strokeDasharray;
            _self.div.style.strokeDashoffset        = styles.strokeDashoffset;
            _self.div.style.strokeLinecap           = styles.strokeLinecap;
            _self.div.style.strokeLinejoin          = styles.strokeLinejoin;
            _self.div.style.strokeMiterlimit        = styles.strokeMiterlimit;
            _self.div.style.strokeOpacity           = styles.strokeOpacity;
            _self.div.style.strokeWidth             = styles.strokeWidth;
            _self.div.style.tableLayout             = styles.tableLayout;
            _self.div.style.textAlign               = styles.textAlign;
            _self.div.style.textAnchor              = styles.textAnchor;
            _self.div.style.textDecoration          = styles.textDecoration;
            _self.div.style.textIndent              = styles.textIndent;
            _self.div.style.textOverflow            = styles.textOverflow;
            _self.div.style.textRendering           = styles.textRendering;
            _self.div.style.textShadow              = styles.textShadow;
            _self.div.style.textTransform           = styles.textTransform;
            _self.div.style.top                     = Utils.convertToPx(styles.top);
            _self.div.style.transform               = styles.transform;
            _self.div.style.transformOrigin         = styles.transformOrigin;
            _self.div.style.transformStyle          = styles.transformStyle;
            
            if (styles.transition) { _self.div.style.transition = styles.transition; }

            _self.div.style.transitionDelay         = styles.transitionDelay;
            _self.div.style.transitionDuration      = styles.transitionDuration;

            if (styles.transitionProperty) { _self.div.style.transitionProperty = styles.transitionProperty; }

            _self.div.style.transitionTimingFunction = styles.transitionTimingFunction;
            _self.div.style.unicodeBidi             = styles.unicodeBidi;
            _self.div.style.vectorEffect            = styles.vectorEffect;
            _self.div.style.visibility              = styles.visibility;
            _self.div.style.whiteSpace              = styles.whiteSpace;
            _self.div.style.widows                  = styles.widows;


            _self.div.style.width                   = Utils.convertToPx(styles.width);

            _self.div.style.wordBreak               = styles.wordBreak;
            _self.div.style.wordSpacing             = styles.wordSpacing;
            _self.div.style.wordWrap                = styles.wordWrap;
            _self.div.style.zIndex                  = styles.zIndex;

        }

        // @@iterator()
        // getPropertyCSSValue()
        // getPropertyPriority()
        // getPropertyValue()
        // item()
        // removeProperty()
        // setProperty()

        return this;

    };
})();
