# Troubleshooting Guide - Morpion Otaku Battle

## 🚨 Common Issues and Solutions

### 1. Server Won't Start

**Problem**: `python app.py` shows errors
**Solutions**:
- Ensure Python 3.7+ is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5000 is available: `netstat -an | grep 5000`

### 2. Missing Character Images

**Problem**: Characters show "Image not found"
**Solutions**:
- Ensure all character images are in the root directory
- Check file names match exactly: `asta.jpg`, `deku.jpg`, etc.
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Verify file permissions (read access required)

### 3. Browser Compatibility Issues

**Problem**: Game doesn't load or functions incorrectly
**Solutions**:
- Use modern browsers: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Enable JavaScript in browser settings
- Clear browser cache and cookies
- Disable browser extensions that might block JavaScript

### 4. Mobile Touch Issues

**Problem**: Touch controls don't work on mobile
**Solutions**:
- Ensure device supports touch events
- Try refreshing the page
- Check if mobile optimization is enabled in settings
- Use portrait orientation for better experience

### 5. Audio Not Working

**Problem**: No sound effects or music
**Solutions**:
- Check browser audio permissions
- Ensure audio is enabled in game settings (⚙️ button)
- Check device volume settings
- Some browsers require user interaction before playing audio

### 6. AI Mode Not Functioning

**Problem**: AI doesn't make moves
**Solutions**:
- Ensure server is running properly
- Check browser console for JavaScript errors (F12)
- Try refreshing the page
- Select AI mode properly before starting game

### 7. Settings Not Saving

**Problem**: Themes, language, or audio settings reset
**Solutions**:
- Check if browser allows localStorage
- Disable incognito/private browsing mode
- Clear browser data and restart
- Ensure JavaScript is enabled

### 8. Performance Issues

**Problem**: Game runs slowly or lags
**Solutions**:
- Close other browser tabs
- Disable advanced visual effects in settings
- Use a more powerful device
- Check available system memory

### 9. Python Dependency Errors

**Problem**: `pip install` fails or missing modules
**Solutions**:
```bash
# Update pip
python -m pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v

# Try with user flag
pip install -r requirements.txt --user

# For Windows users
python -m pip install -r requirements.txt
```

### 10. Port Already in Use

**Problem**: "Address already in use" error
**Solutions**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill the process or use different port
python app.py --port 5001
```

## 🔧 Advanced Troubleshooting

### Enable Debug Mode
Add this to `app.py` before `app.run()`:
```python
app.config['DEBUG'] = True
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Check Browser Console
1. Press F12 to open developer tools
2. Go to Console tab
3. Look for error messages
4. Report errors with full stack trace

### Network Issues
If game works locally but not on network:
1. Check firewall settings
2. Ensure port 5000 is open
3. Use `0.0.0.0` as host instead of `localhost`

## 📞 Getting Help

If you're still having issues:

1. **Check GitHub Issues**: Look for similar problems
2. **Create New Issue**: Include:
   - Operating system and version
   - Python version (`python --version`)
   - Browser and version
   - Full error messages
   - Steps to reproduce

3. **Join Community**: 
   - GitHub Discussions
   - Discord server (coming soon)

## 🐛 Reporting Bugs

When reporting bugs, please include:
- **Environment**: OS, Python version, browser
- **Steps to reproduce**: Detailed sequence
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console errors**: Browser developer tools output

## ✅ System Requirements

### Minimum Requirements
- **OS**: Windows 7+, macOS 10.12+, Linux (any modern distro)
- **Python**: 3.7 or higher
- **RAM**: 512 MB available
- **Browser**: Chrome 70+, Firefox 65+, Safari 12+, Edge 75+
- **Network**: Not required (runs locally)

### Recommended Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Python**: 3.9 or higher
- **RAM**: 2 GB available
- **Browser**: Latest version of any modern browser
- **Screen**: 1024x768 minimum, 1920x1080 recommended