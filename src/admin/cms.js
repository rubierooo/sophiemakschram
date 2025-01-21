import CMS from "netlify-cms-app";

// Import your site's CSS
import "/bundle.css"; // Adjust path as needed

// Register the CSS with the CMS preview pane
CMS.registerPreviewStyle("/bundle.css");
