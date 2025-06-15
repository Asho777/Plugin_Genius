// AI Service for Plugin Genius

// Define AI model interface
export interface AIModel {
  id: string;
  name: string;
  systemPrompt: string;
  apiEndpoint?: string;
}

// Define message interface
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Available AI models
export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    systemPrompt: `You are a WordPress plugin development expert. Your task is to help users create high-quality, secure, and efficient WordPress plugins.

When creating plugins:
1. Always include proper plugin headers
2. Follow WordPress coding standards
3. Implement security best practices
4. Create clean, well-documented code
5. Provide explanations for your implementation choices

If the user asks for a specific feature, provide complete, working code for a WordPress plugin that implements that feature.`
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
    systemPrompt: `You are a WordPress plugin development assistant. Help users create WordPress plugins by providing code examples and explanations.

When creating plugins:
1. Include standard plugin headers
2. Follow WordPress coding standards
3. Implement basic security measures
4. Create functional code
5. Explain your implementation`
  },
  {
    id: 'claude',
    name: 'Claude',
    systemPrompt: `You are a WordPress plugin development expert. Your task is to help users create high-quality, secure, and efficient WordPress plugins.

When creating plugins:
1. Always include proper plugin headers
2. Follow WordPress coding standards
3. Implement security best practices
4. Create clean, well-documented code
5. Provide explanations for your implementation choices

If the user asks for a specific feature, provide complete, working code for a WordPress plugin that implements that feature.`
  }
];

// Local storage key for API keys
const API_KEYS_STORAGE_KEY = 'pluginGenius_apiKeys';

/**
 * Get API key for a specific AI model
 */
export const getApiKey = async (modelId: string): Promise<string | null> => {
  try {
    const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (!storedKeys) return null;
    
    const apiKeys = JSON.parse(storedKeys);
    return apiKeys[modelId] || null;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

/**
 * Save API key for a specific AI model
 */
export const saveApiKey = async (modelId: string, apiKey: string): Promise<void> => {
  try {
    const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    const apiKeys = storedKeys ? JSON.parse(storedKeys) : {};
    
    apiKeys[modelId] = apiKey;
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
  } catch (error) {
    console.error('Error saving API key:', error);
    throw new Error('Failed to save API key');
  }
};

/**
 * Send a message to the AI model and get a response
 */
export const sendMessage = async (modelId: string, messages: Message[]): Promise<string> => {
  try {
    const apiKey = await getApiKey(modelId);
    if (!apiKey) {
      throw new Error(`API key for ${modelId} is not set`);
    }
    
    // For demo purposes, we'll simulate a response
    // In a real application, you would make an API call to the AI service
    return simulateAIResponse(modelId, messages);
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
};

/**
 * Simulate AI response for demo purposes
 */
const simulateAIResponse = (modelId: string, messages: Message[]): string => {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!lastUserMessage) {
    return "I don't see a question. How can I help you create a WordPress plugin?";
  }
  
  const userMessage = lastUserMessage.content.toLowerCase();
  
  // Simulate different responses based on user input
  if (userMessage.includes('contact form') || userMessage.includes('contact us')) {
    return `I'd be happy to help you create a contact form plugin! Here's a simple implementation:

\`\`\`php
<?php
/**
 * Plugin Name: Simple Contact Form
 * Description: A lightweight contact form plugin for WordPress
 * Version: 1.0.0
 * Author: Plugin Genius
 * Text Domain: simple-contact-form
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Register shortcode
function scf_contact_form_shortcode() {
    ob_start();
    ?>
    <div class="scf-contact-form">
        <form id="scf-form" method="post">
            <div class="scf-form-group">
                <label for="scf-name">Name</label>
                <input type="text" id="scf-name" name="scf-name" required>
            </div>
            
            <div class="scf-form-group">
                <label for="scf-email">Email</label>
                <input type="email" id="scf-email" name="scf-email" required>
            </div>
            
            <div class="scf-form-group">
                <label for="scf-subject">Subject</label>
                <input type="text" id="scf-subject" name="scf-subject" required>
            </div>
            
            <div class="scf-form-group">
                <label for="scf-message">Message</label>
                <textarea id="scf-message" name="scf-message" rows="5" required></textarea>
            </div>
            
            <div class="scf-form-group">
                <button type="submit" name="scf-submit">Send Message</button>
            </div>
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('contact_form', 'scf_contact_form_shortcode');

// Process form submission
function scf_process_form() {
    if (isset($_POST['scf-submit'])) {
        $name = sanitize_text_field($_POST['scf-name']);
        $email = sanitize_email($_POST['scf-email']);
        $subject = sanitize_text_field($_POST['scf-subject']);
        $message = sanitize_textarea_field($_POST['scf-message']);
        
        // Validate email
        if (!is_email($email)) {
            wp_die('Invalid email address. Please go back and try again.');
        }
        
        // Get admin email
        $admin_email = get_option('admin_email');
        
        // Email headers
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $name . ' <' . $email . '>',
            'Reply-To: ' . $email
        );
        
        // Email content
        $email_content = "
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <p>{$message}</p>
        ";
        
        // Send email
        $mail_sent = wp_mail($admin_email, 'Contact Form: ' . $subject, $email_content, $headers);
        
        if ($mail_sent) {
            wp_redirect(add_query_arg('scf-sent', '1', wp_get_referer()));
            exit;
        } else {
            wp_die('There was an error sending the email. Please try again later.');
        }
    }
}
add_action('init', 'scf_process_form');

// Enqueue styles
function scf_enqueue_styles() {
    wp_enqueue_style(
        'scf-styles',
        plugin_dir_url(__FILE__) . 'assets/css/style.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'scf_enqueue_styles');
\`\`\`

This plugin creates a simple contact form that can be added to any page or post using the shortcode `[contact_form]`. It includes:

1. Form fields for name, email, subject, and message
2. Form validation and sanitization
3. Email sending functionality using WordPress's wp_mail()
4. Basic styling (you'll need to create the CSS file)

To complete this plugin, you should:

1. Create an assets/css/style.css file with your form styling
2. Add success/error messages to display to users
3. Consider adding AJAX submission to avoid page reloads
4. Add anti-spam measures like CAPTCHA or honeypot fields

Would you like me to expand on any of these aspects?`;
  } else if (userMessage.includes('slider') || userMessage.includes('carousel')) {
    return `Here's a simple image slider plugin for WordPress:

\`\`\`php
<?php
/**
 * Plugin Name: Simple Image Slider
 * Description: A lightweight image slider plugin for WordPress
 * Version: 1.0.0
 * Author: Plugin Genius
 * Text Domain: simple-image-slider
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Register shortcode
function sis_slider_shortcode($atts) {
    // Shortcode attributes
    $atts = shortcode_atts(
        array(
            'ids' => '',
            'height' => '400px',
            'width' => '100%',
            'speed' => '3000',
        ),
        $atts,
        'image_slider'
    );
    
    // Get image IDs
    $image_ids = explode(',', $atts['ids']);
    if (empty($image_ids)) {
        return '<p>Please add image IDs to the shortcode.</p>';
    }
    
    // Generate unique ID for this slider
    $slider_id = 'sis-slider-' . wp_rand(1000, 9999);
    
    // Start output buffer
    ob_start();
    ?>
    <div id="<?php echo esc_attr($slider_id); ?>" class="sis-slider" style="height: <?php echo esc_attr($atts['height']); ?>; width: <?php echo esc_attr($atts['width']); ?>;">
        <div class="sis-slider-wrapper">
            <?php foreach ($image_ids as $index => $image_id) : ?>
                <?php $image = wp_get_attachment_image_src($image_id, 'large'); ?>
                <?php if ($image) : ?>
                    <div class="sis-slide <?php echo ($index === 0) ? 'active' : ''; ?>">
                        <img src="<?php echo esc_url($image[0]); ?>" alt="<?php echo esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>">
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        
        <button class="sis-prev" aria-label="Previous slide">❮</button>
        <button class="sis-next" aria-label="Next slide">❯</button>
        
        <div class="sis-dots">
            <?php foreach ($image_ids as $index => $image_id) : ?>
                <button class="sis-dot <?php echo ($index === 0) ? 'active' : ''; ?>" data-slide="<?php echo esc_attr($index); ?>"></button>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    
    // Enqueue scripts and styles
    wp_enqueue_style('sis-styles');
    wp_enqueue_script('sis-script');
    
    // Add inline script for this specific slider
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        initSlider('<?php echo esc_js($slider_id); ?>', <?php echo esc_js($atts['speed']); ?>);
    });
    </script>
    <?php
    
    return ob_get_clean();
}
add_shortcode('image_slider', 'sis_slider_shortcode');

// Register and enqueue scripts and styles
function sis_enqueue_assets() {
    wp_register_style(
        'sis-styles',
        plugin_dir_url(__FILE__) . 'assets/css/slider.css',
        array(),
        '1.0.0'
    );
    
    wp_register_script(
        'sis-script',
        plugin_dir_url(__FILE__) . 'assets/js/slider.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'sis_enqueue_assets');

// Create plugin activation hook
function sis_activate() {
    // Create necessary folders
    $upload_dir = wp_upload_dir();
    $sis_dir = $upload_dir['basedir'] . '/sis-cache';
    
    if (!file_exists($sis_dir)) {
        wp_mkdir_p($sis_dir);
    }
}
register_activation_hook(__FILE__, 'sis_activate');
\`\`\`

You'll also need to create the JavaScript and CSS files for the slider functionality:

**assets/js/slider.js**:
\`\`\`javascript
function initSlider(sliderId, speed) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.sis-slide');
    const dots = slider.querySelectorAll('.sis-dot');
    const prevBtn = slider.querySelector('.sis-prev');
    const nextBtn = slider.querySelector('.sis-next');
    
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, speed);
    
    // Next slide function
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    
    // Previous slide function
    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    // Go to specific slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = n;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, speed);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, speed);
    });
}
\`\`\`

**assets/css/slider.css**:
\`\`\`css
.sis-slider {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
}

.sis-slider-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}

.sis-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.sis-slide.active {
    opacity: 1;
}

.sis-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sis-prev, .sis-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s;
}

.sis-prev {
    left: 10px;
}

.sis-next {
    right: 10px;
}

.sis-prev:hover, .sis-next:hover {
    background-color: rgba(0, 0, 0, 0.8);
}

.sis-dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.sis-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.sis-dot.active, .sis-dot:hover {
    background-color: white;
}
\`\`\`

To use this slider, you would add a shortcode like this to your page or post:

\`[image_slider ids="123,456,789" height="500px" speed="5000"]\`

Where:
- \`ids\` is a comma-separated list of image attachment IDs
- \`height\` is the height of the slider (default: 400px)
- \`width\` is the width of the slider (default: 100%)
- \`speed\` is the time between slides in milliseconds (default: 3000)

This is a basic implementation. You could enhance it with:
1. More transition effects
2. Responsive design improvements
3. Touch swipe support for mobile
4. Lazy loading for better performance`;
  } else if (userMessage.includes('seo') || userMessage.includes('search engine')) {
    return `Here's a basic SEO plugin for WordPress that adds essential meta tags and sitemap functionality:

\`\`\`php
<?php
/**
 * Plugin Name: Simple SEO Tools
 * Description: Basic SEO functionality for WordPress sites
 * Version: 1.0.0
 * Author: Plugin Genius
 * Text Domain: simple-seo-tools
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Simple_SEO_Tools {
    
    /**
     * Constructor
     */
    public function __construct() {
        // Add meta tags to head
        add_action('wp_head', array($this, 'add_meta_tags'), 1);
        
        // Add SEO fields to post edit screen
        add_action('add_meta_boxes', array($this, 'add_seo_meta_box'));
        add_action('save_post', array($this, 'save_seo_meta_data'));
        
        // Add settings page
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        
        // Generate sitemap
        add_action('init', array($this, 'generate_sitemap'));
        
        // Register activation hook
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Flush rewrite rules for sitemap
        flush_rewrite_rules();
    }
    
    /**
     * Add meta tags to head
     */
    public function add_meta_tags() {
        global $post;
        
        // Default values
        $title = get_bloginfo('name');
        $description = get_bloginfo('description');
        $keywords = '';
        $canonical = home_url(add_query_arg(array(), $GLOBALS['wp']->request));
        
        // Single post/page
        if (is_singular()) {
            // Get custom SEO data
            $custom_title = get_post_meta($post->ID, '_sst_meta_title', true);
            $custom_description = get_post_meta($post->ID, '_sst_meta_description', true);
            $custom_keywords = get_post_meta($post->ID, '_sst_meta_keywords', true);
            
            // Use custom data if available
            $title = !empty($custom_title) ? $custom_title : get_the_title() . ' | ' . get_bloginfo('name');
            $description = !empty($custom_description) ? $custom_description : wp_trim_words(strip_shortcodes(get_the_content()), 30, '...');
            $keywords = !empty($custom_keywords) ? $custom_keywords : '';
            
            // Get featured image for og:image
            $thumbnail = get_the_post_thumbnail_url($post->ID, 'large');
        }
        
        // Output meta tags
        echo '<meta name="description" content="' . esc_attr($description) . '" />' . "\n";
        
        if (!empty($keywords)) {
            echo '<meta name="keywords" content="' . esc_attr($keywords) . '" />' . "\n";
        }
        
        echo '<link rel="canonical" href="' . esc_url($canonical) . '" />' . "\n";
        
        // Open Graph tags
        echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<meta property="og:url" content="' . esc_url($canonical) . '" />' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
        
        if (is_singular() && !empty($thumbnail)) {
            echo '<meta property="og:image" content="' . esc_url($thumbnail) . '" />' . "\n";
        }
        
        // Twitter Card tags
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($description) . '" />' . "\n";
        
        if (is_singular() && !empty($thumbnail)) {
            echo '<meta name="twitter:image" content="' . esc_url($thumbnail) . '" />' . "\n";
        }
    }
    
    /**
     * Add SEO meta box to post edit screen
     */
    public function add_seo_meta_box() {
        $screens = array('post', 'page');
        
        foreach ($screens as $screen) {
            add_meta_box(
                'sst_seo_meta_box',
                'SEO Settings',
                array($this, 'render_seo_meta_box'),
                $screen,
                'normal',
                'high'
            );
        }
    }
    
    /**
     * Render SEO meta box
     */
    public function render_seo_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('sst_save_meta_data', 'sst_meta_nonce');
        
        // Get saved values
        $meta_title = get_post_meta($post->ID, '_sst_meta_title', true);
        $meta_description = get_post_meta($post->ID, '_sst_meta_description', true);
        $meta_keywords = get_post_meta($post->ID, '_sst_meta_keywords', true);
        
        // Output fields
        ?>
        <p>
            <label for="sst_meta_title">Meta Title:</label>
            <input type="text" id="sst_meta_title" name="sst_meta_title" value="<?php echo esc_attr($meta_title); ?>" style="width: 100%;" />
            <span class="description">Leave empty to use the post title</span>
        </p>
        
        <p>
            <label for="sst_meta_description">Meta Description:</label>
            <textarea id="sst_meta_description" name="sst_meta_description" rows="3" style="width: 100%;"><?php echo esc_textarea($meta_description); ?></textarea>
            <span class="description">Recommended length: 150-160 characters</span>
        </p>
        
        <p>
            <label for="sst_meta_keywords">Meta Keywords:</label>
            <input type="text" id="sst_meta_keywords" name="sst_meta_keywords" value="<?php echo esc_attr($meta_keywords); ?>" style="width: 100%;" />
            <span class="description">Comma-separated list of keywords</span>
        </p>
        <?php
    }
    
    /**
     * Save SEO meta data
     */
    public function save_seo_meta_data($post_id) {
        // Check if nonce is set
        if (!isset($_POST['sst_meta_nonce'])) {
            return;
        }
        
        // Verify nonce
        if (!wp_verify_nonce($_POST['sst_meta_nonce'], 'sst_save_meta_data')) {
            return;
        }
        
        // Check if autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check permissions
        if ('page' === $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        
        // Save meta title
        if (isset($_POST['sst_meta_title'])) {
            update_post_meta($post_id, '_sst_meta_title', sanitize_text_field($_POST['sst_meta_title']));
        }
        
        // Save meta description
        if (isset($_POST['sst_meta_description'])) {
            update_post_meta($post_id, '_sst_meta_description', sanitize_textarea_field($_POST['sst_meta_description']));
        }
        
        // Save meta keywords
        if (isset($_POST['sst_meta_keywords'])) {
            update_post_meta($post_id, '_sst_meta_keywords', sanitize_text_field($_POST['sst_meta_keywords']));
        }
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'SEO Settings',
            'Simple SEO',
            'manage_options',
            'simple-seo-tools',
            array($this, 'render_settings_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('sst_settings_group', 'sst_settings');
        
        add_settings_section(
            'sst_general_section',
            'General Settings',
            array($this, 'render_general_section'),
            'simple-seo-tools'
        );
        
        add_settings_field(
            'sst_home_title',
            'Home Page Title',
            array($this, 'render_home_title_field'),
            'simple-seo-tools',
            'sst_general_section'
        );
        
        add_settings_field(
            'sst_home_description',
            'Home Page Description',
            array($this, 'render_home_description_field'),
            'simple-seo-tools',
            'sst_general_section'
        );
        
        add_settings_field(
            'sst_home_keywords',
            'Home Page Keywords',
            array($this, 'render_home_keywords_field'),
            'simple-seo-tools',
            'sst_general_section'
        );
    }
    
    /**
     * Render general section
     */
    public function render_general_section() {
        echo '<p>Configure general SEO settings for your site.</p>';
    }
    
    /**
     * Render home title field
     */
    public function render_home_title_field() {
        $options = get_option('sst_settings');
        $value = isset($options['home_title']) ? $options['home_title'] : '';
        
        echo '<input type="text" name="sst_settings[home_title]" value="' . esc_attr($value) . '" style="width: 300px;" />';
        echo '<p class="description">Leave empty to use the site name</p>';
    }
    
    /**
     * Render home description field
     */
    public function render_home_description_field() {
        $options = get_option('sst_settings');
        $value = isset($options['home_description']) ? $options['home_description'] : '';
        
        echo '<textarea name="sst_settings[home_description]" rows="3" style="width: 300px;">' . esc_textarea($value) . '</textarea>';
        echo '<p class="description">Leave empty to use the site tagline</p>';
    }
    
    /**
     * Render home keywords field
     */
    public function render_home_keywords_field() {
        $options = get_option('sst_settings');
        $value = isset($options['home_keywords']) ? $options['home_keywords'] : '';
        
        echo '<input type="text" name="sst_settings[home_keywords]" value="' . esc_attr($value) . '" style="width: 300px;" />';
        echo '<p class="description">Comma-separated list of keywords</p>';
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Simple SEO Tools Settings</h1>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('sst_settings_group');
                do_settings_sections('simple-seo-tools');
                submit_button();
                ?>
            </form>
            
            <div class="card">
                <h2>XML Sitemap</h2>
                <p>Your sitemap is available at: <a href="<?php echo esc_url(home_url('sitemap.xml')); ?>" target="_blank"><?php echo esc_html(home_url('sitemap.xml')); ?></a></p>
                <p>Search engines use this file to discover pages on your site.</p>
            </div>
        </div>
        <?php
    }
    
    /**
     * Generate XML sitemap
     */
    public function generate_sitemap() {
        // Add rewrite rule for sitemap
        add_rewrite_rule('sitemap\.xml$', 'index.php?sitemap=1', 'top');
        
        // Add query var
        add_filter('query_vars', function($vars) {
            $vars[] = 'sitemap';
            return $vars;
        });
        
        // Generate sitemap when requested
        add_action('template_redirect', function() {
            if (get_query_var('sitemap') == 1) {
                $this->render_sitemap();
                exit;
            }
        });
    }
    
    /**
     * Render XML sitemap
     */
    private function render_sitemap() {
        // Set content type
        header('Content-Type: application/xml; charset=UTF-8');
        
        // Start XML output
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        
        // Add home page
        echo '<url>' . "\n";
        echo '  <loc>' . esc_url(home_url('/')) . '</loc>' . "\n";
        echo '  <lastmod>' . date('Y-m-d\TH:i:sP', strtotime(get_lastpostmodified('GMT'))) . '</lastmod>' . "\n";
        echo '  <changefreq>daily</changefreq>' . "\n";
        echo '  <priority>1.0</priority>' . "\n";
        echo '</url>' . "\n";
        
        // Get all published posts
        $posts = get_posts(array(
            'post_type' => array('post', 'page'),
            'post_status' => 'publish',
            'numberposts' => -1,
        ));
        
        // Add each post/page to sitemap
        foreach ($posts as $post) {
            echo '<url>' . "\n";
            echo '  <loc>' . esc_url(get_permalink($post->ID)) . '</loc>' . "\n";
            echo '  <lastmod>' . date('Y-m-d\TH:i:sP', strtotime($post->post_modified_gmt)) . '</lastmod>' . "\n";
            echo '  <changefreq>' . ($post->post_type == 'page' ? 'monthly' : 'weekly') . '</changefreq>' . "\n";
            echo '  <priority>' . ($post->post_type == 'page' ? '0.8' : '0.6') . '</priority>' . "\n";
            echo '</url>' . "\n";
        }
        
        // Get all published custom post types
        $custom_post_types = get_post_types(array(
            'public' => true,
            '_builtin' => false
        ), 'names', 'and');
        
        if (!empty($custom_post_types)) {
            $custom_posts = get_posts(array(
                'post_type' => $custom_post_types,
                'post_status' => 'publish',
                'numberposts' => -1,
            ));
            
            // Add each custom post to sitemap
            foreach ($custom_posts as $post) {
                echo '<url>' . "\n";
                echo '  <loc>' . esc_url(get_permalink($post->ID)) . '</loc>' . "\n";
                echo '  <lastmod>' . date('Y-m-d\TH:i:sP', strtotime($post->post_modified_gmt)) . '</lastmod>' . "\n";
                echo '  <changefreq>weekly</changefreq>' . "\n";
                echo '  <priority>0.6</priority>' . "\n";
                echo '</url>' . "\n";
            }
        }
        
        // Get all public taxonomies
        $taxonomies = get_taxonomies(array(
            'public' => true
        ), 'names', 'and');
        
        if (!empty($taxonomies)) {
            foreach ($taxonomies as $taxonomy) {
                $terms = get_terms(array(
                    'taxonomy' => $taxonomy,
                    'hide_empty' => true,
                ));
                
                // Add each term archive to sitemap
                foreach ($terms as $term) {
                    echo '<url>' . "\n";
                    echo '  <loc>' . esc_url(get_term_link($term)) . '</loc>' . "\n";
                    echo '  <changefreq>weekly</changefreq>' . "\n";
                    echo '  <priority>0.4</priority>' . "\n";
                    echo '</url>' . "\n";
                }
            }
        }
        
        // End XML output
        echo '</urlset>';
    }
}

// Initialize the plugin
new Simple_SEO_Tools();
\`\`\`

This plugin provides several essential SEO features:

1. **Meta Tags**:
   - Adds meta description, keywords, canonical URL
   - Adds Open Graph tags for better social sharing
   - Adds Twitter Card tags

2. **SEO Meta Box**:
   - Adds custom fields to posts and pages for SEO title, description, and keywords
   - Allows per-page customization of SEO elements

3. **XML Sitemap**:
   - Automatically generates a sitemap.xml file
   - Includes posts, pages, custom post types, and taxonomy archives
   - Updates automatically when content changes

4. **Settings Page**:
   - Allows configuration of home page SEO elements
   - Provides access to the sitemap

To enhance this plugin, you could add:

1. **Schema.org markup** for rich snippets in search results
2. **Robots.txt editor**
3. **Content analysis** for SEO optimization suggestions
4. **Breadcrumb navigation** support
5. **301 redirect manager**
6. **Google Analytics integration**

Would you like me to expand on any of these features?`;
  } else {
    // Default response for other queries
    return `I'd be happy to help you create a WordPress plugin! To get started, I'll need to know what functionality you'd like to implement. Here are some common types of WordPress plugins:

1. **Content Enhancement Plugins**:
   - Custom post types and taxonomies
   - Shortcodes for special content
   - Blocks for the Gutenberg editor

2. **User Interface Plugins**:
   - Custom widgets
   - Navigation enhancements
   - Modal popups or notifications

3. **Functionality Plugins**:
   - Contact forms
   - Social media integration
   - E-commerce features
   - SEO optimization

4. **Admin Plugins**:
   - Custom dashboard widgets
   - Admin interface modifications
   - User role management

5. **Integration Plugins**:
   - Third-party API connections
   - Payment gateway integration
   - Email marketing services

Please let me know what specific functionality you'd like to implement, and I'll provide you with the code for a complete WordPress plugin that meets your needs.`;
  }
};
